using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.Extensions.Configuration;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GamesWebApp.Controllers
{
    public class GamesController : Controller
    {
        private const string PlaysFileName = "plays-ervwalter.json";
        private const string RecentPlaysFilename = "recent-plays-ervwalter.json";
        private const string CollectionFileName = "collection-ervwalter.json";

        private string _connectionString;

        public GamesController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("CacheStorage");
        }

        [HttpGet]
        [Route("api/plays")]
        [ResponseCache(Location = ResponseCacheLocation.Any, Duration = 30)]
        public ActionResult Plays()
        {
            CloudBlobContainer container = GetContainer();
            CloudBlockBlob plays = container.GetBlockBlobReference(PlaysFileName);
            string json = plays.DownloadText();
            return JsonString(json);
        }

        [HttpGet]
        [Route("api/collection")]
        [ResponseCache(Location = ResponseCacheLocation.Any, Duration = 30)]
        public ActionResult Collection()
        {
            CloudBlobContainer container = GetContainer();
            CloudBlockBlob collection = container.GetBlockBlobReference(CollectionFileName);
            string json = collection.DownloadText();
            return JsonString(json);
        }

        private static ActionResult JsonString(string json)
        {
            var response = new ContentResult();
            response.Content = json;
            response.ContentType = "application/json";
            return response;
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
