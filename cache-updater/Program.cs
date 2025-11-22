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

#if DEBUG
            // In debug builds, run once and exit
            var runOnce = true;
#else
            // In release builds, run continuously
            var runOnce = false;
#endif

            do
            {
                try
                {
                    var buildDate = System.Reflection.Assembly.GetExecutingAssembly().GetBuildDate();
                    logger.LogInformation($"Starting cache update at {DateTime.Now} with build from {buildDate}");

                    var username = config["BGG_USERNAME"];
                    var password = config["BGG_PASSWORD"];
                    var doSpacesKey = config["DO_SPACES_KEY"];
                    var doSpacesSecret = config["DO_SPACES_SECRET"];
                    var doSpacesRegion = config["DO_SPACES_REGION"] ?? "nyc3";
                    var bucketName = config["DO_SPACES_BUCKET"] ?? "games";

                    if (string.IsNullOrEmpty(username))
                    {
                        throw new Exception("BGG_USERNAME environment variable is not set");
                    }
                    if (string.IsNullOrEmpty(doSpacesKey))
                    {
                        throw new Exception("DO_SPACES_KEY environment variable is not set");
                    }
                    if (string.IsNullOrEmpty(doSpacesSecret))
                    {
                        throw new Exception("DO_SPACES_SECRET environment variable is not set");
                    }
                    if (string.IsNullOrEmpty(bucketName))
                    {
                        throw new Exception("DO_SPACES_BUCKET environment variable is not set");
                    }

                    using var updater = new CacheUpdater(logger);
                    await updater.InitializeAsync(doSpacesKey, doSpacesSecret, doSpacesRegion, bucketName, username, password);
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

                    if (runOnce)
                    {
                        logger.LogInformation("Debug mode: Exiting after single iteration");
                        return;
                    }

                    // Get delay from environment variable or use default (60 minutes)
                    var delayMinutes = int.TryParse(config["UPDATE_INTERVAL_MINUTES"], out var mins) ? mins : 60;
                    logger.LogInformation($"Waiting {delayMinutes} minutes before next update...");
                    await Task.Delay(TimeSpan.FromMinutes(delayMinutes));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex.ToString());

                    if (runOnce)
                    {
                        logger.LogError("Debug mode: Exiting due to error");
                        return;
                    }

                    // Wait 1 hour before retrying after an error
                    logger.LogInformation("Waiting 60 minutes before retrying after error...");
                    await Task.Delay(TimeSpan.FromMinutes(60));
                }
            } while (!runOnce);
        }
    }
}
