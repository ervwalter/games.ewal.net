using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Console;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Reflection;
using Microsoft.Extensions.Logging.Abstractions;

namespace GamesCacheUpdater
{
    public class CustomConsoleFormatter : ConsoleFormatter
    {
        private static string GetLogLevelString(LogLevel level)
        {
            return level switch
            {
                LogLevel.Trace => "TRACE",
                LogLevel.Debug => "DEBUG",
                LogLevel.Information => "INFO ",
                LogLevel.Warning => "WARN ",
                LogLevel.Error => "ERROR",
                LogLevel.Critical => "CRITC",
                _ => "     "
            };
        }

        public CustomConsoleFormatter() : base("CustomFormatter") { }

        public override void Write<TState>(in LogEntry<TState> logEntry, IExternalScopeProvider scopeProvider, TextWriter textWriter)
        {
            var message = logEntry.Formatter?.Invoke(logEntry.State, logEntry.Exception);
            if (message == null)
            {
                return;
            }

            textWriter.Write(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            textWriter.Write(" | ");
            textWriter.Write(GetLogLevelString(logEntry.LogLevel));
            textWriter.Write(" | ");
            textWriter.Write(message);
            
            if (logEntry.Exception != null)
            {
                textWriter.WriteLine();
                textWriter.Write(logEntry.Exception.ToString());
            }
            textWriter.WriteLine();
        }
    }

    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Setup logging with timestamp and log level
            using var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder
                    .AddFilter("Microsoft", LogLevel.Warning)
                    .AddFilter("System", LogLevel.Warning)
                    .AddFilter("GamesCacheUpdater", LogLevel.Information)
                    .AddConsoleFormatter<CustomConsoleFormatter, ConsoleFormatterOptions>()
                    .AddConsole(options => 
                    {
                        options.FormatterName = "CustomFormatter";
                    });
            });
            var logger = loggerFactory.CreateLogger<Program>();

            // Load configuration from environment variables
            var config = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .Build();

            while (true)
            {
                try
                {
                    var buildDate = System.Reflection.Assembly.GetExecutingAssembly().GetBuildDate();
                    logger.LogInformation($"Starting cache update at {DateTime.Now} with build from {buildDate}");
                    
                    var username = config["BGG_USERNAME"];
                    var password = config["BGG_PASSWORD"];
                    var storage = config["CACHE_STORAGE"];
                    
                    if (string.IsNullOrEmpty(username))
                    {
                        throw new Exception("BGG_USERNAME environment variable is not set");
                    }
                    if (string.IsNullOrEmpty(storage))
                    {
                        throw new Exception("CACHE_STORAGE environment variable is not set");
                    }

                    var updater = new CacheUpdater(logger);
                    await updater.InitializeAsync(storage, username, password);
                    await updater.DownloadPlaysAsync();
                    await updater.DownloadTopTenAsync();
                    
                    try
                    {
                        await updater.DownloadCollectionAsync();
                    }
                    catch (TooManyRetriesException)
                    {
                        await updater.LoadExistingCollection();
                    }
                    
                    await updater.LoadCachedGameDetailsAsync();
                    await updater.DownloadUpdatedGameDetailsAsync();
                    updater.ProcessCollection();
                    updater.ProcessPlays();
                    updater.ProcessTopTen();
                    updater.GenerateStats();
                    await updater.SaveEverythingAsync();
                    
                    // Wait for frontend ISR cache to expire
                    logger.LogInformation("Waiting to make sure frontend ISR cache is completely expired...");
                    await Task.Delay(70000); // 70 seconds
                    await updater.TriggerFrontendRefresh();

                    // Get delay from environment variable or use default (15 minutes)
                    var delayMinutes = int.TryParse(config["UPDATE_INTERVAL_MINUTES"], out var mins) ? mins : 15;
                    logger.LogInformation($"Waiting {delayMinutes} minutes before next update...");
                    await Task.Delay(TimeSpan.FromMinutes(delayMinutes));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex.ToString());
                    // Wait 5 minutes before retrying after an error
                    await Task.Delay(TimeSpan.FromMinutes(5));
                }
            }
        }
    }
}
