using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using Flurl;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace GamesCacheUpdater
{
	internal class BggClient : IDisposable
	{
		private static SemaphoreSlim _semaphore = new SemaphoreSlim(1);
		private static DateTimeOffset _lastDownloadCompleted = DateTimeOffset.MinValue;
		private static readonly TimeSpan MinimumTimeBetweenDownloads = new TimeSpan(0, 0, 0, 5, 100); // 5.1 second between BGG requests to prevent them from blocking us

		private const string LoginUrl = "https://boardgamegeek.com/login/api/v1";
		private const string BaseUrl = "https://boardgamegeek.com/xmlapi2/";
		private const string LegacyBaseUrl = "https://boardgamegeek.com/xmlapi/";

		private CookieContainer _cookies = new CookieContainer();
		private HttpClient _httpClient;
		private ILogger _log;

		public BggClient(ILogger log)
		{
			_log = log;
			var handler = new HttpClientHandler()
			{
				CookieContainer = _cookies,
				UseCookies = true
			};
			_httpClient = new HttpClient(handler)
			{
				Timeout = TimeSpan.FromMilliseconds(15000)
			};
		}

		private static void ResetMinimumTimeTracker()
		{
			_lastDownloadCompleted = DateTimeOffset.Now;
		}

		private static async Task WaitForMinimumTimeToPassAsync(int multiplier = 1)
		{
			var now = DateTimeOffset.Now;
			var timeSinceLastDownload = now - _lastDownloadCompleted;
			if (timeSinceLastDownload < (MinimumTimeBetweenDownloads * multiplier))
			{
				var requiredDelay = (MinimumTimeBetweenDownloads * multiplier) - timeSinceLastDownload;
				Debug.WriteLine("Pausing {0} ms", requiredDelay.TotalMilliseconds);
				await Task.Delay(requiredDelay);
			}
		}

		private async Task<XDocument> DownloadDataAsync(string url)
		{
			_semaphore.Wait();
			try
			{
				await WaitForMinimumTimeToPassAsync();
				Debug.WriteLine("Downloading " + url);
				XDocument data = null;
				var retries = 0;
				try
				{
					while (data == null && retries < 5)
					{
						retries++;
						try
						{
							using (var response = await _httpClient.GetAsync(url))
							{
								if (response.StatusCode == HttpStatusCode.Accepted)
								{
									_log.LogInformation("Download isn't ready.  Trying again in a moment...");

									//
									// this whole section of playing with the semaphore inside the try/finally 
									// seems dangerous, but I'm doing it anyway...
									//

									ResetMinimumTimeTracker();
									// let other queued up requests happen...
									_semaphore.Release();
									// very small delay to really make sure other requests get the lock
									await Task.Delay(50);
									// get back in line for the lock before continuing
									_semaphore.Wait();
									await WaitForMinimumTimeToPassAsync(retries + 2);

									continue;
								}
								response.EnsureSuccessStatusCode();
								var content = await response.Content.ReadAsStringAsync();
								data = XDocument.Parse(content);
							}
						}
						catch (HttpRequestException ex)
						{
							_log.LogInformation("DEBUG: HttpRequestException: {0}", ex.Message);
							throw;
						}
						catch (Exception ex)
						{
							Debug.WriteLine("DEBUG: Exception: {0}", ex.ToString());
							throw;
						}
					}
				}
				finally
				{

				}
				if (data != null)
				{
					return data;
				}
				else
				{
					_log.LogWarning("Too many retries, failing");
					throw new TooManyRetriesException();
				}
			}
			finally
			{
				ResetMinimumTimeTracker();
				_semaphore.Release();
			}

		}

		public async Task LoginAsync(string username, string password)
		{
			_semaphore.Wait();
			try
			{
				await WaitForMinimumTimeToPassAsync();
				Debug.WriteLine("Logging in " + username);
				// NameValueCollection parameters = HttpUtility.ParseQueryString("");
				// parameters.Add("redirect", "1");
				// parameters.Add("username", username);
				// parameters.Add("password", password);
				var payload = JsonConvert.SerializeObject(new { credentials = new { username = username, password = password } });
				var content = new StringContent(payload, Encoding.UTF8, "application/json");
				
				HttpResponseMessage response = null;
				try
				{
					try
					{
						response = await _httpClient.PostAsync(LoginUrl, content);
					}
					catch (HttpRequestException)
					{
						if (response?.StatusCode != HttpStatusCode.Redirect && response?.StatusCode != HttpStatusCode.MovedPermanently)
						{
							throw;
						}
					}

					var usernameCookie = _cookies.GetCookies(new Uri("https://boardgamegeek.com"))["bggusername"];
					if (usernameCookie == null || usernameCookie.Value == null || usernameCookie.Value != username)
					{
						throw new Exception("Invalid login");
					}
				}
				finally
				{
					response?.Dispose();
				}
			}
			finally
			{
				ResetMinimumTimeTracker();
				_semaphore.Release();
			}
		}

		public async Task<List<CollectionItem>> GetCollectionAsync(string username, bool expansions)
		{
			var url = new Url(BaseUrl).AppendPathSegment("/collection").SetQueryParams(new
			{
				username = username,
				stats = 1,
				showprivate = 1
			});

			if (expansions)
			{
				_log.LogInformation("...downloading expansions");
				url.SetQueryParam("subtype", "boardgameexpansion");
			}
			else
			{
				_log.LogInformation("...downloading base games");
				url.SetQueryParam("excludesubtype", "boardgameexpansion");

			}

			var data = await DownloadDataAsync(url.ToString());
			var items = from item in data.Descendants("item")
						select new CollectionItem
						{
							GameId = item.AttributeAs<string>("objectid"),
							Name = item.Element("name").As<string>(),
							Image = item.Element("image").As<string>(),
							Thumbnail = item.Element("thumbnail").As<string>(),

							IsExpansion = expansions,
							YearPublished = item.Element("yearpublished").As<int>(),

							MinPlayers = item.Element("stats").AttributeAs<int>("minplayers"),
							MaxPlayers = item.Element("stats").AttributeAs<int>("maxplayers"),
							PlayingTime = item.Element("stats").AttributeAs<int?>("playingtime"),
							MinPlayingTime = item.Element("stats").AttributeAs<int?>("minplaytime"),
							MaxPlayingTime = item.Element("stats").AttributeAs<int?>("maxplaytime"),

							AverageRating = item.Element("stats").Element("rating").Element("average").AttributeAs<decimal?>("value"),
							Rank = ParseRanking(item.Element("stats").Element("rating")),

							NumPlays = item.Element("numplays").As<int>(),
							Rating = item.Element("stats").Element("rating").AttributeAs<decimal?>("value", null, "n/a"),

							Owned = item.Element("status").AttributeAs<int>("own").AsBool(),
							PreOrdered = item.Element("status").AttributeAs<int>("preordered").AsBool(),
							ForTrade = item.Element("status").AttributeAs<int>("fortrade").AsBool(),
							PreviousOwned = item.Element("status").AttributeAs<int>("prevowned").AsBool(),
							Want = item.Element("status").AttributeAs<int>("want").AsBool(),
							WantToBuy = item.Element("status").AttributeAs<int>("wanttobuy").AsBool(),
							WantToPlay = item.Element("status").AttributeAs<int>("wanttoplay").AsBool(),
							WishList = item.Element("status").AttributeAs<int>("wishlist").AsBool(),
							WishListPriority = item.Element("status").AttributeAs<int>("wishlistpriority"),

							UserComment = item.Element("comment").As<string>(),
							AcquisitionDate = ParseDate(item.Element("privateinfo").AttributeAs<string>("acquisitiondate")),
							PrivateComment = item.Descendants("privatecomment").FirstOrDefault().As<string>(),

						};

			return items.ToList();
		}

		public async Task<List<PlayItem>> GetPlaysAsync(string username)
		{

			var url = new Url(BaseUrl).AppendPathSegment("/plays").SetQueryParams(new
			{
				username = username,
				page = 1,
				subtype = "boardgame",
				excludesubtype = "videogame"
			});

			_log.LogInformation("...downloading page 1");
			var dataPages = new List<XDocument>
			{
				await DownloadDataAsync(url.ToString())
			};
			var totalPlays = dataPages[0].Element("plays").AttributeAs<int>("total");
			if (totalPlays > 100)
			{
				var remaining = totalPlays - 100;
				var page = 2;
				while (remaining > 0)
				{
					_log.LogInformation(string.Format("...downloading page {0}", page));
					url.SetQueryParam("page", page);
					dataPages.Add(await DownloadDataAsync(url.ToString()));
					page++;
					remaining -= 100;
				}
			}

			var plays = new List<PlayItem>();

			foreach (var data in dataPages)
			{
				plays.AddRange(from play in data.Element("plays").Elements("play")
							   select new PlayItem
							   {
								   PlayId = play.AttributeAs<string>("id"),
								   GameId = play.Element("item").AttributeAs<string>("objectid"),
								   Name = play.Element("item").AttributeAs<string>("name"),
								   PlayDate = ParseDate(play.AttributeAs<string>("date")),
								   NumPlays = Math.Max(play.AttributeAs<int>("quantity"), 1),
								   Duration = play.AttributeAs<int>("length"),
								   Incomplete = play.AttributeAs<int>("incomplete").AsBool(),
								   ExcludeFromStats = play.AttributeAs<int>("nowinstats").AsBool(),
								   Location = play.AttributeAs<string>("location", ""),
								   Players = ParsePlayers(play.Element("players")),
								   Comments = play.Element("comments").As<string>()
							   });
			}

			return plays;
		}

		public async Task<List<GameDetails>> GetGamesAsync(IEnumerable<string> gameIds)
		{
			var url = new Url(BaseUrl).AppendPathSegment("/thing");
			url.SetQueryParam("stats", 1);
			url.SetQueryParam("id", string.Join(",", gameIds), true);

			_log.LogInformation(string.Format("...downloading details for {0} games", gameIds.Count()));
			_log.LogInformation(url.ToString());
			try
			{
				var data = await DownloadDataAsync(url.ToString());
				var games = (from item in data.Element("items").Elements("item")
							 select new GameDetails
							 {
								 GameId = item.AttributeAs<string>("id"),
								 Name = (from name in item.Elements("name")
										 where name.AttributeAs<string>("type") == "primary"
										 select name).FirstOrDefault().AttributeAs<string>("value"),
								 Description = item.Element("description").As<string>(),
								 Image = item.Element("image").As<string>(),
								 Thumbnail = item.Element("thumbnail").As<string>(),

								 MinPlayers = item.Element("minplayers").AttributeAs<int?>("value"),
								 MaxPlayers = item.Element("maxplayers").AttributeAs<int?>("value"),
								 PlayingTime = item.Element("playingtime").AttributeAs<int?>("value"),
								 MinPlayingTime = item.Element("minplaytime").AttributeAs<int?>("value"),
								 MaxPlayingTime = item.Element("maxplaytime").AttributeAs<int?>("value"),
								 Mechanics = (from link in item.Elements("link")
											  where link.AttributeAs<string>("type") == "boardgamemechanic"
											  select link.AttributeAs<string>("value")).ToList(),

								 IsExpansion = (from link in item.Elements("link")
												where link.AttributeAs<string>("type") == "boardgamecategory"
												  && link.AttributeAs<string>("id") == "1024"
												select link).FirstOrDefault() != null,
								 YearPublished = item.Element("yearpublished").AttributeAs<int?>("value"),

								 BggRating = item.Element("statistics").Element("ratings").Element("bayesaverage").AttributeAs<decimal?>("value"),
								 AverageRating = item.Element("statistics").Element("ratings").Element("average").AttributeAs<decimal?>("value"),
								 Rank = ParseRanking(item.Element("statistics").Element("ratings")),
								 AverageWeight = item.Element("statistics").Element("ratings").Element("averageweight").AttributeAs<decimal?>("value"),

								 Designers = (from link in item.Elements("link")
											  where link.AttributeAs<string>("type") == "boardgamedesigner"
											  select link.AttributeAs<string>("value")).ToList(),
								 Publishers = (from link in item.Elements("link")
											   where link.AttributeAs<string>("type") == "boardgamepublisher"
											   select link.AttributeAs<string>("value")).ToList(),
								 Artists = (from link in item.Elements("link")
											where link.AttributeAs<string>("type") == "boardgameartist"
											select link.AttributeAs<string>("value")).ToList(),

								 Expansions = (from link in item.Elements("link")
											   where link.AttributeAs<string>("type") == "boardgameexpansion"
												  && link.AttributeAs<bool>("inbound") == false
											   select new BoardGameLink
											   {
												   Name = link.AttributeAs<string>("value"),
												   GameId = link.AttributeAs<string>("id")
											   }).ToList(),
								 Expands = (from link in item.Elements("link")
											where link.AttributeAs<string>("type") == "boardgameexpansion"
											   && link.AttributeAs<bool>("inbound") == true
											select new BoardGameLink
											{
												Name = link.AttributeAs<string>("value"),
												GameId = link.AttributeAs<string>("id")
											}).ToList()
							 }).ToList();

				foreach (var game in games)
				{
					if (game.MinPlayingTime.HasValue && game.MaxPlayingTime.HasValue)
					{
						game.PlayingTime = (game.MinPlayingTime + game.MaxPlayingTime) / 2;
					}
					game.Timestamp = DateTimeOffset.UtcNow;
				}
				return games;
			}
			catch (Exception ex)
			{
				_log.LogInformation("EXCEPTION: {0}", ex.ToString());
				throw;
			}

		}

		internal async Task<List<TopTenItem>> GetTopTenAsync(string username)
		{
			var url = new Url(BaseUrl).AppendPathSegment("/user").SetQueryParams(new
			{
				name = username,
				top = 1
			});

			var data = await DownloadDataAsync(url.ToString());
			var items = from item in data.Descendants("item")
						select new TopTenItem
						{
							Rank = item.AttributeAs<int>("rank"),
							GameId = item.AttributeAs<string>("id")
						};
			return items.ToList();
		}

		#region ParseFunctions
		private int? ParseRanking(XElement ratings)
		{
			var value = (from rank in ratings.Element("ranks").Elements("rank")
						 where rank.Attribute("id").Value == "1"
						 select rank.Attribute("value").Value).SingleOrDefault();
			if (value == null)
			{
				return null;
			}
			else if (value.ToLower().Trim() == "not ranked")
			{
				return null;
			}

			if (!int.TryParse(value, out var ranking))
			{
				return null;
			}
			return ranking;
		}

		private DateTime? ParseDate(string value)
		{
			if (!DateTime.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
			{
				return null;
			}
			return date;
		}

		private List<Player> ParsePlayers(XElement players)
		{
			var list = new List<Player>();
			if (players != null)
			{
				list.AddRange(from player in players.Elements("player")
							  where !string.IsNullOrWhiteSpace(player.AttributeAs<string>("name"))
							  select new Player
							  {
								  Name = player.AttributeAs<string>("name"),
								  Username = player.AttributeAs<string>("username"),
								  UserId = player.AttributeAs<string>("userid"),
								  StartPosition = player.AttributeAs<string>("startposition"),
								  Color = player.AttributeAs<string>("color"),
								  Score = player.AttributeAs<string>("score"),
								  Rating = player.AttributeAs<string>("rating"),
								  New = player.AttributeAs<int>("new").AsBool(),
								  Win = player.AttributeAs<int>("win").AsBool()
							  });
			}
			return list;
		}


		#endregion

		public void Dispose()
		{
			_httpClient?.Dispose();
		}
	}


	public class TooManyRetriesException : Exception
	{

	}
}
