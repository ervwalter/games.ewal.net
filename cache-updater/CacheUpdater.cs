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
using System.Net.Http;

namespace GamesCacheUpdater
{
	public class CacheUpdater
	{
		private const string GameDetailsFilename = "game-details.json";
		private const string PlaysFilename = "plays-{0}.json";
		private const string RecentPlaysFilename = "recent-plays-{0}.json";
		private const string TopTenFilename = "top10-{0}.json";
		private const string CollectionFilename = "collection-{0}.json";
		private const string StatsFilename = "stats-{0}.json";

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
		Stats _stats;


		List<CollectionItem> _collection;
		ILookup<string, CollectionItem> _collectionById;
		bool _collectionFromCache = false;
		private bool _playsChanged;
		private bool _recentPlaysChanged;
		private bool _topTenChanged;
		private bool _statsChanged;
		private bool _collectionChanged;

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
			// start both immediately
			var baseGames = _client.GetCollectionAsync(_username, false);
			var expansions = _client.GetCollectionAsync(_username, true);
			_collection = (await baseGames)
				.Concat(await expansions)
				.OrderBy(g => g.Name).ToList();

			_collectionById = _collection.ToLookup(g => g.GameId);
		}

		private async Task<string> GetBlobString(string filename)
		{
			var blob = _container.GetBlockBlobReference(filename);
			if (await blob.ExistsAsync())
			{
				return await blob.DownloadTextAsync();
			}
			return null;
		}

		private async Task<T> GetExistingBlob<T>(string filename, bool createIfMissingOrInvalid) where T : new()
		{
			string json = await GetBlobString(filename);
			if (json != null)
			{
				try
				{
					return JsonConvert.DeserializeObject<T>(json);
				}
				catch { }
			}
			// got here so it's either missing or invalid
			if (createIfMissingOrInvalid)
			{
				return new T();
			}
			else
			{
				return default(T);
			}
		}

		public async Task LoadCachedGameDetailsAsync()
		{
			_log.LogInformation("Loading cached game details");
			_games = await GetExistingBlob<List<GameDetails>>(GameDetailsFilename, true);
		}


		public async Task LoadExistingCollection()
		{
			_log.LogInformation("Loading cached collection");
			_collection = await GetExistingBlob<List<CollectionItem>>(CollectionFilename, false);
			if (_collection == null)
			{
				throw new Exception("Failed to load cached collection");
			}
			_collectionById = _collection.ToLookup(g => g.GameId);
			_collectionFromCache = true;
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
			updateNeeded.UnionWith(outdated.Select(g => g.GameId).Take(100)); // don't update more than 100 outdated games per run

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
				// if (string.IsNullOrWhiteSpace(play.Location)) {
				// 	play.Location = "Home";
				// }
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
			if (_collectionFromCache)
			{
				_log.LogInformation("Skipping processing for collection since cache was used");
				return;
			}
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
				if (game.Rating == null || game.Rating < 0)
				{
					game.Rating = 0;
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

				// round decimals
				game.BGGRating = game.BGGRating.SingleDecimalPlace();
				game.AverageRating = game.AverageRating.SingleDecimalPlace();
				game.AverageWeight = game.AverageWeight.SingleDecimalPlace();

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
								if (game.AllExpansions == null)
								{
									game.AllExpansions = new List<CollectionItem>();
								}
								game.AllExpansions.Add(expansion.Clone());
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
				if (game.AllExpansions != null)
				{
					foreach (var expansion in game.AllExpansions)
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
						expansion.SortableShortName = removeArticles.Replace(expansion.ShortName.ToLower(), "");
					}
					game.OwnedExpansions = game.AllExpansions.Where(g => g.Owned).ToList();
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
						if (newlinePosition >= 0)
						{
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
						game.Thumbnail = collectionEntry.Thumbnail;
						game.Image = collectionEntry.Image;
					}
					else
					{
						game.Name = gameDetails.Name;
						game.Thumbnail = gameDetails.Thumbnail;
						game.Image = gameDetails.Image;
					}
					game.Designers = gameDetails.Designers;
					game.Mechanics = gameDetails.Mechanics;
					game.NumPlays = gameDetails.NumPlays;
					game.YearPublished = gameDetails.YearPublished;
					game.Rating = gameDetails.Rating;
					if (game.Rating == null || game.Rating < 0)
					{
						game.Rating = 0;
					}
				}

			}
		}

		internal void GenerateStats()
		{
			_log.LogInformation("Generating stats");
			_stats = new Stats();
			var thisYear = DateTime.Today.Year;

			_stats.Collection = CalculateCollectionStats();
			_stats.PlaysAllTime = CalculatePlayStats(_plays);
			_stats.PlaysThisYear = CalculatePlayStats(_plays.Where(p => p.PlayDate?.Year == thisYear).ToList());
			_stats.ThisYear = thisYear;
		}

		private CollectionStats CalculateCollectionStats()
		{
			// collection stats
			var stats = new CollectionStats();
			decimal ratingNumerator = 0;
			int ratingDenominator = 0;

			foreach (var game in _collection)
			{
				if (game.Owned)
				{
					stats.NumberOfGames++;
					if (game.OwnedExpansions != null)
					{
						stats.NumberOfExpansions += game.OwnedExpansions.Count;
					}
					// how many games have never been played
					if (game.NumPlays == 0 && !game.ForTrade && !game.CollectingOnly)
					{
						stats.YetToBePlayed++;
					}
					// include in average rating
					if (game.Rating != null && game.Rating > 0)
					{
						ratingNumerator += game.Rating.Value;
						ratingDenominator++;
					}

					if (game.Rank != null && game.Rank <= 100)
					{
						stats.Top100Games++;
					}

					if (game.Owned && game.WishList && game.WishListPriority == 5)
					{
						stats.ToBePruned++;
					}
				}
				else if (game.PreviousOwned)
				{
					stats.NumberOfPreviouslyOwned++;
				}
				else if (game.PreOrdered)
				{
					stats.Preordered++;
				}
				else if (game.WantToBuy)
				{
					stats.WantToBuy++;
				}
			}
			if (ratingDenominator > 0)
			{
				stats.AverageRating = ratingNumerator / ratingDenominator;
			}
			return stats;
		}

		private PlayStats CalculatePlayStats(List<PlayItem> plays)
		{
			var stats = new PlayStats();
			stats.NumberOfPlays = plays.Sum(p => p.NumPlays);
			stats.UniqueGames = plays.GroupBy(p => p.GameId).Count();
			var players = new HashSet<string>();
			var locations = new HashSet<string>();
			int newGames = 0;
			int totalDuration = 0;

			foreach (var play in plays)
			{
				if (play.Players != null)
				{
					foreach (var player in play.Players)
					{
						// count how many games are marked as new to me
						if (player.Name.ToLower() == "erv")
						{
							if (player.New)
							{
								newGames++;
							}
						}

						// exclude anonymous players from the player count
						if (player.Name.ToLower() != "anonymous player")
						{
							players.Add(player.Name.ToLower());
						}
					}
				}

				totalDuration += Duration(play);
				locations.Add(play.Location.ToLower());
			}

			stats.NamedPlayers = players.Count;
			stats.locations = locations.Count;
			stats.NewGames = newGames;
			stats.HoursPlayed = (int)Math.Round(((decimal)totalDuration) / 60);

			var gamePlayCounts = plays.GroupBy(p => p.GameId).Select(g => g.Sum(p => p.NumPlays));
			foreach (var gamePlayCount in gamePlayCounts)
			{
				if (gamePlayCount >= 25)
				{
					stats.Quarters++;
				}
				else if (gamePlayCount >= 10)
				{
					stats.Dimes++;
				}
				else if (gamePlayCount >= 5)
				{
					stats.Nickles++;
				}
			}
			return stats;
		}

		private int Duration(PlayItem play)
		{
			if (play.Duration != null && play.Duration > 0)
			{
				return play.Duration.Value;
			}
			else if (play.EstimatedDuration != null && play.EstimatedDuration > 0)
			{
				// use the estimated duration of an explicit one was not specified
				return play.EstimatedDuration.Value * (play.NumPlays);
			}
			return 0;
		}


		private async Task UploadJsonBlob(string filename, string json)
		{
			var blob = _container.GetBlockBlobReference(filename);
			await blob.UploadTextAsync(json);
			blob.Properties.ContentType = "application/json";
			await blob.SetPropertiesAsync();
		}

		private async Task<bool> UploadDataIfChanged<T>(string filename, T data)
		{
			var json = JsonConvert.SerializeObject(data);
			var previousJson = await GetBlobString(filename);
			if (json != previousJson)
			{
				_log.LogInformation("Uploading {0}", filename);
				await UploadJsonBlob(filename, json);
				return true;
			}

			_log.LogInformation("Skipping upload for {0} as it is unchanged", filename);
			return false;
		}

		public async Task SaveEverythingAsync()
		{
			_log.LogInformation("Saving results to blob storage");
			await UploadDataIfChanged(GameDetailsFilename, _games);
			_playsChanged = await UploadDataIfChanged(string.Format(PlaysFilename, _username), _plays);
			_recentPlaysChanged = await UploadDataIfChanged(string.Format(RecentPlaysFilename, _username), _plays.Take(100));
			_topTenChanged = await UploadDataIfChanged(string.Format(TopTenFilename, _username), _topTen);
			_statsChanged = await UploadDataIfChanged(string.Format(StatsFilename, _username), _stats);
			if (!_collectionFromCache)
			{
				_collectionChanged = await UploadDataIfChanged(string.Format(CollectionFilename, _username), _collection);
			}
		}

		public async Task TriggerFrontendRefresh()
		{
			_log.LogInformation("Triggering frontend refreshes");
			var client = new HttpClient();
			string url;

			if (_statsChanged || _recentPlaysChanged)
			{
				try
				{
					url = "https://games.ewal.net/overview";
					var data = await client.GetStringAsync(url);
					_log.LogInformation("Got {0} bytes from {1}", data.Length, url);
				}
				catch { }
			}

			if (_playsChanged)
			{
				try
				{
					url = "https://games.ewal.net/insights";
					var data = await client.GetStringAsync(url);
					_log.LogInformation("Got {0} bytes from {1}", data.Length, url);
				}
				catch { }
			}

			if (_playsChanged)
			{
				try
				{
					url = "https://games.ewal.net/mostplayed";
					var data = await client.GetStringAsync(url);
					_log.LogInformation("Got {0} bytes from {1}", data.Length, url);
				}
				catch { }
			}

			if (_topTenChanged)
			{
				try
				{
					url = "https://games.ewal.net/topten";
					var data = await client.GetStringAsync(url);
					_log.LogInformation("Got {0} bytes from {1}", data.Length, url);
				}
				catch { }
			}

			if (_collectionChanged)
			{
				try
				{
					url = "https://games.ewal.net/collection";
					var data = await client.GetStringAsync(url);
					_log.LogInformation("Got {0} bytes from {1}", data.Length, url);
				}
				catch { }
			}
		}
	}
}
