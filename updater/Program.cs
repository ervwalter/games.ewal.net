using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace GamesCacheUpdater
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");

            var configuration = builder.Build();

            Go(configuration).Wait();
        }

        static async Task Go(IConfiguration configuration) {
            var updater = new CacheUpdater(configuration);

            await updater.Initialize();
            updater.DownloadPlays();
            updater.DownloadCollection();
            updater.DownloadTopTen();
            await updater.LoadCachedGameDetails();
            updater.DownloadUpdatedGameDetails();
            updater.ProcessPlays();
            updater.ProcessCollection();
            updater.ProcessTopTen();
            await updater.SaveEverything();
            
        }
    }
}
