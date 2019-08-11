using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Newtonsoft.Json;
using GamesCacheUpdater;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GamesWebApp.Controllers
{
    public class GamesController : Controller
    {
        private const string PlaysFilename = "plays-ervwalter.json";
        private const string RecentPlaysFilename = "recent-plays-ervwalter.json";
        private const string CollectionFilename = "collection-ervwalter.json";
        private const string TopTenFilename = "top10-ervwalter.json";

        private string _connectionString;

        public GamesController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("CacheStorage");
        }

        [HttpGet]
        [Route("api/plays")]
        [ResponseCache(Location = ResponseCacheLocation.Any, Duration = 30)]
        public async Task<List<PlayItem>> Plays()
        {
            CloudBlobContainer container = GetContainer();
            CloudBlockBlob playsJson = container.GetBlockBlobReference(PlaysFilename);
            string json = await playsJson.DownloadTextAsync();
            var plays = JsonConvert.DeserializeObject<List<PlayItem>>(json);
            return plays;
        }

        [HttpGet]
        [Route("api/plays/recent")]
        [ResponseCache(Location = ResponseCacheLocation.Any, Duration = 30)]
        public async Task<List<PlayItem>> RecentPlays()
        {
            CloudBlobContainer container = GetContainer();
            CloudBlockBlob playsJson = container.GetBlockBlobReference(RecentPlaysFilename);
            string json = await playsJson.DownloadTextAsync();
            var plays = JsonConvert.DeserializeObject<List<PlayItem>>(json);
            return plays;
        }

        [HttpGet]
        [Route("api/collection")]
        [ResponseCache(Location = ResponseCacheLocation.Any, Duration = 30)]
        public async Task<List<CollectionItem>> Collection()
        {
            CloudBlobContainer container = GetContainer();
            CloudBlockBlob collectionJson = container.GetBlockBlobReference(CollectionFilename);
            string json = await collectionJson.DownloadTextAsync();
            var collection = JsonConvert.DeserializeObject<List<CollectionItem>>(json);
            return collection;
        }

        [HttpGet]
        [Route("api/topten")]
        [ResponseCache(Location = ResponseCacheLocation.Any, Duration = 30)]
        public async Task<List<TopTenItem>> TopTen()
        {
            CloudBlobContainer container = GetContainer();
            CloudBlockBlob topTenJson = container.GetBlockBlobReference(TopTenFilename);
            string json = await topTenJson.DownloadTextAsync();
            var topTen = JsonConvert.DeserializeObject<List<TopTenItem>>(json);
            return topTen;
        }

        private CloudBlobContainer GetContainer()
        {
            CloudStorageAccount storage = CloudStorageAccount.Parse(_connectionString);
            CloudBlobClient blob = storage.CreateCloudBlobClient();
            CloudBlobContainer container = blob.GetContainerReference("gamescache");
            return container;
        }
    }
}
