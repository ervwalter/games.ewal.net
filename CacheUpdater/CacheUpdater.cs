using MoreLinq;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Logging;

namespace GamesCacheUpdater
{
    public class CacheUpdater
    {
        private const string GameDetailsFilename = "game-details.json";
        private const string PlaysFilename = "plays-{0}.json";
        private const string RecentPlaysFilename = "recent-plays-{0}.json";
        private const string TopTenFilename = "top10-{0}.json";
        private const string CollectionFilename = "collection-{0}.json";

        private ILogger _log;
        private string _username;
        private string _password;
        private BggClient _client;
        CloudStorageAccount _storage;
        CloudBlobClient _blob;
        CloudBlobContainer _container;

        List<GameDetails> _games;
        Dictionary<string, GameDetails> _gamesById;

        List<PlayItem> _plays;
        List<TopTenItem> _topTen;


        List<CollectionItem> _collection;
        ILookup<string, CollectionItem> _collectionById;

        public CacheUpdater(ILogger log)
        {
            _log = log;
        }

        public async Task InitializeAsync(string storageConnectionString, string username, string password)
        {
            _storage = CloudStorageAccount.Parse(storageConnectionString);
            _log.LogInformation("Connecting to Azure Storage using {0}", _storage.Credentials.AccountName);
            _blob = _storage.CreateCloudBlobClient();
            _container = _blob.GetContainerReference("gamescache");
            await _container.CreateIfNotExistsAsync();

            _username = username;
            _password = password;
            _client = new BggClient(_log);
            if (string.IsNullOrWhiteSpace(_password))
            {
                _log.LogInformation("Using BGG Anonymously");
            }
            else
            {
                _log.LogInformation("Logging into BGG as {0}", _username);
                await _client.LoginAsync(_username, _password);
            }

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                NullValueHandling = NullValueHandling.Ignore
            };
        }

        public async Task DownloadPlaysAsync()
        {
            _log.LogInformation("Downloading plays for {0}", _username);
            _plays = await _client.GetPlaysAsync(_username);
        }

        public async Task DownloadCollectionAsync()
        {
            _log.LogInformation("Downloading collection for {0}", _username);
            _collection = (await _client.GetCollectionAsync(_username, false))
                .Concat(await _client.GetCollectionAsync(_username, true))
                .OrderBy(g => g.Name).ToList();

            _collectionById = _collection.ToLookup(g => g.GameId);
        }

        public async Task LoadCachedGameDetailsAsync()
        {
            _log.LogInformation("Loading cached game details");
            var blob = _container.GetBlockBlobReference(GameDetailsFilename);
            if (await blob.ExistsAsync())
            {
                string json = await blob.DownloadTextAsync();
                try
                {
                    _games = JsonConvert.DeserializeObject<List<GameDetails>>(json);
                }
                catch
                {
                    _games = new List<GameDetails>();
                }
            }
            else
            {
                _games = new List<GameDetails>();
            }
        }

        public async Task DownloadUpdatedGameDetailsAsync()
        {
            // collect the list of games that are in plays or in the collection
            var updateNeeded = new HashSet<string>();
            updateNeeded.UnionWith(_collection.Select(g => g.GameId));
            updateNeeded.UnionWith(_plays.Select(p => p.GameId));
            updateNeeded.UnionWith(_topTen.Select(t => t.GameId));

            // filter down to just those we don't already have int the cache
            var available = new HashSet<string>(_games.Select(g => g.GameId));
            updateNeeded.ExceptWith(available);

            int newCount = updateNeeded.Count;

            // add back in ones that are outdated and need an update
            var cutoff = DateTimeOffset.UtcNow.AddHours(-6);
            var random = new Random();
            var outdated = _games.Where(g => g.Timestamp.AddHours(-1 * random.NextDouble()) < cutoff);
            updateNeeded.UnionWith(outdated.Select(g => g.GameId));

            _log.LogInformation("Getting updated details for {0} new games and {1} out-of-date games", newCount, updateNeeded.Count - newCount);
            _gamesById = _games.ToDictionary(g => g.GameId);
            foreach (var ids in updateNeeded.Batch(50))
            {
                var games = await _client.GetGamesAsync(ids);
                foreach (var game in games)
                {
                    _gamesById[game.GameId] = game;
                }
            }
            _games = _gamesById.Values.ToList();
        }

        public void ProcessPlays()
        {
            _log.LogInformation("Processing {0} plays", _plays.Count);
            foreach (var play in _plays)
            {
                if (play.Duration.HasValue && play.Duration == 0)
                {
                    play.Duration = null;
                }

                if (_collectionById.Contains(play.GameId))
                {
                    var game = _collectionById[play.GameId].First();
                    play.Image = game.Image;
                    play.Thumbnail = game.Thumbnail;
                    play.Name = game.Name;
                    if (play.Duration == null)
                    {
                        play.EstimatedDuration = game.PlayingTime;
                    }
                    play.Rating = game.Rating;
                }
                else if (_gamesById.ContainsKey(play.GameId))
                {
                    var game = _gamesById[play.GameId];
                    play.Image = game.Image;
                    play.Thumbnail = game.Thumbnail;
                    if (play.Duration == null)
                    {
                        play.EstimatedDuration = game.PlayingTime;
                    }
                }
            }
            _plays = _plays.OrderByDescending(p => p.PlayDate).ThenByDescending(p => p.PlayId).ToList();
        }
         
        public void ProcessCollection()
        {
            _log.LogInformation("Processing {0} collection games", _collection.Count);
            IEnumerable<CollectionItem> games = _collection;
            var gamesById = _collectionById;

            foreach (var game in games)
            {
                // manually mark games as expansions if they are flagged as such in the comments
                if (!string.IsNullOrWhiteSpace(game.PrivateComment) && game.PrivateComment.Contains("%Expands:"))
                {
                    game.IsExpansion = true;
                }
            }

            var articles = "the,a,an,het,een,de,das,ein,der,le,la,il,el".Split(',');
            Regex removeArticles = new Regex("^(" + string.Join("|", articles.Select(a => a + @"\ ")) + ")");
            Regex descriptionRegEx = new Regex(@"%Description:(.*\w+.*)$");
            Regex playingTimeRegEx = new Regex(@"%PlayingTime:(.*\w+.*)$");
            Regex expansionCommentExpression = new Regex(@"%Expands:(.*\w+.*)\[(\d+)\]", RegexOptions.Compiled);

            foreach (var game in games)
            {
                game.SortableName = removeArticles.Replace(game.Name.Trim().ToLower(), "");
                if (game.MinPlayingTime.HasValue && game.MaxPlayingTime.HasValue)
                {
                    game.PlayingTime = (game.MinPlayingTime + game.MaxPlayingTime) / 2;
                }

                GameDetails gameDetails = null;
                if (_gamesById.ContainsKey(game.GameId))
                {
                    gameDetails = _gamesById[game.GameId];
                    game.Mechanics = gameDetails.Mechanics;
                    game.BGGRating = gameDetails.BggRating;
                    game.AverageWeight = gameDetails.AverageWeight;
                    game.Artists = gameDetails.Artists;
                    game.Publishers = gameDetails.Publishers;
                    game.Designers = gameDetails.Designers;
                    gameDetails.Rating = game.Rating; // backfill rating
                    gameDetails.NumPlays = game.NumPlays; // backfill numPlays
                    if (!game.IsExpansion)
                    {
                        //game.Description = HttpUtility.HtmlDecode(gameDetails.Description).Trim();
                    }
                }

                if (!string.IsNullOrWhiteSpace(game.PrivateComment))
                {
                    if (game.PrivateComment.Contains("%CollectingOnly%"))
                    {
                        game.CollectingOnly = true;
                    }
                    if (game.PrivateComment.Contains("%Description:"))
                    {
                        var match = descriptionRegEx.Match(game.PrivateComment);
                        if (match.Success)
                        {
                            game.Description = match.Groups[1].Value.Trim();
                            if (gameDetails != null && !string.IsNullOrWhiteSpace(game.Description))
                            {
                                gameDetails.Description = game.Description; // backfill description
                            }
                        }
                    }

                    if (game.PrivateComment.Contains("%PlayingTime:"))
                    {
                        var match = playingTimeRegEx.Match(game.PrivateComment);
                        if (match.Success)
                        {
                            int playingTime;
                            if (int.TryParse(match.Groups[1].Value.Trim(), out playingTime))
                            {
                                game.PlayingTime = playingTime;
                            }
                        }

                    }
                }

            }

            // collect up all the expansions
            var expansions = from g in games
                             where g.IsExpansion
                             orderby g.Name
                             select g;

            foreach (var expansion in expansions)
            {
                if (_gamesById.ContainsKey(expansion.GameId))
                {
                    var expansionDetails = _gamesById[expansion.GameId];
                    if (expansionDetails != null)
                    {
                        var expandsLinks = new List<BoardGameLink>(expansionDetails.Expands ?? new List<BoardGameLink>());
                        if (!string.IsNullOrWhiteSpace(expansion.PrivateComment) && expansion.PrivateComment.Contains("%Expands:"))
                        {
                            var match = expansionCommentExpression.Match(expansion.PrivateComment);
                            if (match.Success)
                            {
                                var name = match.Groups[1].Value.Trim();
                                var id = match.Groups[2].Value.Trim();
                                expandsLinks.Add(new BoardGameLink
                                {
                                    GameId = id,
                                    Name = name
                                });
                            }
                        }
                        foreach (var link in expandsLinks)
                        {
                            var parentGames = gamesById[link.GameId];
                            foreach (var game in parentGames)
                            {
                                if (game.IsExpansion)
                                {
                                    continue;
                                }
                                if (game.Expansions == null)
                                {
                                    game.Expansions = new List<CollectionItem>();
                                }
                                game.Expansions.Add(expansion.Clone());
                            }
                        }
                    }
                }
            }

            games = from g in games
                    where !g.IsExpansion
                    orderby g.SortableName
                    select g;

            Regex startsWithAlpha = new Regex("^[a-z]");
            foreach (var game in games)
            {
                if (game.Expansions != null)
                {
                    foreach (var expansion in game.Expansions)
                    {
                        var parentName = game.Name.ToLower();
                        if (parentName.Length < expansion.Name.Length && expansion.Name.ToLower().Substring(0, parentName.Length) == parentName)
                        {
                            expansion.ShortName = expansion.Name.Substring(parentName.Length).TrimStart('–', '-', ':', ' ');
                        }
                        else
                        {
                            expansion.ShortName = expansion.Name.Trim();
                        }
                        expansion.SortableShortName = removeArticles.Replace(expansion.ShortName.ToLower(),"");
                    }
                }
            }

            _collection = games.ToList();
        }

        internal async Task DownloadTopTenAsync()
        {
            _log.LogInformation("Downloading top 10 for {0}", _username);
            _topTen = await _client.GetTopTenAsync(_username);
        }

        internal void ProcessTopTen()
        {
            foreach (var game in _topTen)
            {
                if (_gamesById.ContainsKey(game.GameId))
                {
                    var gameDetails = _gamesById[game.GameId];
                    if (!string.IsNullOrWhiteSpace(gameDetails.Description))
                    {
                        var newlinePosition = gameDetails.Description.IndexOf("&#10;");
                        if (newlinePosition >= 0) {
                            game.Description = HttpUtility.HtmlDecode(gameDetails.Description.Substring(0, newlinePosition));
                        }
                        else
                        {
                            game.Description = HttpUtility.HtmlDecode(gameDetails.Description);
                        }
                    }
                    if (_collectionById.Contains(game.GameId))
                    {
                        var collectionEntry = _collectionById[game.GameId].First();
                        game.Name = collectionEntry.Name;
                    }
                    else
                    {
                        game.Name = gameDetails.Name;
                    }
                    game.Designers = gameDetails.Designers;
                    game.Image = gameDetails.Image;
                    game.Mechanics = gameDetails.Mechanics;
                    game.NumPlays = gameDetails.NumPlays;
                    game.Rating = gameDetails.Rating;
                    game.Thumbnail = gameDetails.Thumbnail;
                    game.YearPublished = gameDetails.YearPublished;
                }

            }
        }

        public async Task SaveEverythingAsync()
        {
            _log.LogInformation("Saving results to blob storage");
            var json = JsonConvert.SerializeObject(_games);
            var blob = _container.GetBlockBlobReference(GameDetailsFilename);
            await blob.UploadTextAsync(json);

            json = JsonConvert.SerializeObject(_plays);
            blob = _container.GetBlockBlobReference(string.Format(PlaysFilename, _username));
            await blob.UploadTextAsync(json);

            json = JsonConvert.SerializeObject(_plays.Take(100));
            blob = _container.GetBlockBlobReference(string.Format(RecentPlaysFilename, _username));
            await blob.UploadTextAsync(json);

            json = JsonConvert.SerializeObject(_collection);
            blob = _container.GetBlockBlobReference(string.Format(CollectionFilename, _username));
            await blob.UploadTextAsync(json);

            json = JsonConvert.SerializeObject(_topTen);
            blob = _container.GetBlockBlobReference(string.Format(TopTenFilename, _username));
            await blob.UploadTextAsync(json);
        }


    }
}
