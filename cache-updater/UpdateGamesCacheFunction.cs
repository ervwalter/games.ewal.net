using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Reflection;

namespace GamesCacheUpdater
{
	public static class UpdateGamesCacheFunction
	{
		[FunctionName("UpdateGamesCache")]
		public static async Task Run([TimerTrigger("0 */15 * * * *")] TimerInfo myTimer, ILogger log, ExecutionContext context)
		{
			try
			{
				var config = new ConfigurationBuilder()
					.SetBasePath(context.FunctionAppDirectory)
					.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
					.AddEnvironmentVariables()
					.Build();
				var buildDate = Assembly.GetExecutingAssembly().GetBuildDate();
				log.LogInformation($"Updating Cache at {DateTime.Now} with build from {buildDate.ToString("s", System.Globalization.CultureInfo.InvariantCulture)}");
				var username = config["bgg_username"];
				var password = config["bgg_password"];
				var storage = config["cache_storage"];
				var updater = new CacheUpdater(log);
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
				updater.ProcessPlays();
				updater.ProcessCollection();
				updater.ProcessTopTen();
				updater.GenerateStats();
				await updater.SaveEverythingAsync();
				// the next 2 lines are a workaround until on-demand re-validations are added to the RSC portion of Next.js
				log.LogInformation("Waiting to make sure frontend ISR cache is completely expired...");
				await Task.Delay(70000); // wait 70 seconds to make sure all pages are expired
				await updater.TriggerFrontendRefresh();
			}
			catch (Exception ex)
			{
				log.LogError(ex.ToString());
			}
		}
	}
}
