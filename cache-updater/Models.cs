using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamesCacheUpdater
{

	public class CollectionItem
	{
		public string GameId { get; set; }
		public string Name { get; set; }
		public string SortableName { get; set; }
		public string ShortName { get; set; }
		public string SortableShortName { get; set; }
		public string Description { get; set; }
		public string Image { get; set; }
		public string Thumbnail { get; set; }

		public bool IsExpansion { get; set; }
		public int YearPublished { get; set; }

		public int MinPlayers { get; set; }
		public int MaxPlayers { get; set; }
		public int? PlayingTime { get; set; }
		public int? MinPlayingTime { get; set; }
		public int? MaxPlayingTime { get; set; }
		public List<string> Mechanics { get; set; }

		public decimal? BGGRating { get; set; }
		public decimal? AverageRating { get; set; }
		public int? Rank { get; set; }
		public decimal? AverageWeight { get; set; }

		public List<string> Designers { get; set; }
		public List<string> Publishers { get; set; }
		public List<string> Artists { get; set; }

		public decimal? Rating { get; set; }
		public int NumPlays { get; set; }

		public bool Owned { get; set; }
		public bool PreOrdered { get; set; }
		public bool ForTrade { get; set; }
		public bool PreviousOwned { get; set; }
		public bool Want { get; set; }
		public bool WantToBuy { get; set; }
		public bool WantToPlay { get; set; }
		public bool WishList { get; set; }
		public int WishListPriority { get; set; }
		public string UserComment { get; set; }
		public bool CollectingOnly { get; set; }

		public DateTime? AcquisitionDate { get; set; }

		[JsonIgnore]
		public string PrivateComment { get; set; }

		public List<CollectionItem> AllExpansions { get; set; }
		public List<CollectionItem> OwnedExpansions { get; set; }

		public CollectionItem Clone()
		{
			return new CollectionItem
			{
				GameId = this.GameId,
				Name = this.Name,
				SortableName = this.SortableName,
				ShortName = this.ShortName,
				SortableShortName = this.ShortName,
				Description = this.Description,
				Image = this.Image,
				Thumbnail = this.Thumbnail,
				MinPlayers = this.MinPlayers,
				MaxPlayers = this.MaxPlayers,
				PlayingTime = this.PlayingTime,
				MinPlayingTime = this.MinPlayingTime,
				MaxPlayingTime = this.MaxPlayingTime,
				Mechanics = this.Mechanics,
				IsExpansion = this.IsExpansion,
				YearPublished = this.YearPublished,
				BGGRating = this.BGGRating,
				AverageRating = this.AverageRating,
				Rank = this.Rank,
				AverageWeight = this.AverageWeight,
				Designers = this.Designers,
				Publishers = this.Publishers,
				Artists = this.Artists,
				NumPlays = this.NumPlays,
				Rating = this.Rating,
				Owned = this.Owned,
				PreviousOwned = this.PreviousOwned,
				PreOrdered = this.PreOrdered,
				ForTrade = this.ForTrade,
				Want = this.Want,
				WantToPlay = this.WantToPlay,
				WantToBuy = this.WantToBuy,
				WishList = this.WishList,
				UserComment = this.UserComment,
				AcquisitionDate = this.AcquisitionDate,
				PrivateComment = this.PrivateComment,
				AllExpansions = this.AllExpansions,
				OwnedExpansions = this.OwnedExpansions,
			};
		}

	}

	public class PlayItem
	{
		public string PlayId { get; set; }
		public string GameId { get; set; }
		public string Name { get; set; }
		public string Image { get; set; }
		public string Thumbnail { get; set; }
		public DateTime? PlayDate { get; set; }
		public int NumPlays { get; set; }
		public string Location { get; set; }
		public int? Duration { get; set; }
		public int? EstimatedDuration { get; set; }
		public bool Incomplete { get; set; }
		public bool ExcludeFromStats { get; set; }
		public List<Player> Players { get; set; }
		public string Comments { get; set; }
		public decimal? Rating { get; set; }
	}

	public class Player
	{
		public string Name { get; set; }
		public string Username { get; set; }
		public string UserId { get; set; }
		public string StartPosition { get; set; }
		public string Color { get; set; }
		public string Score { get; set; }
		public string Rating { get; set; }
		public bool New { get; set; }
		public bool Win { get; set; }

	}

	public class GameDetails
	{
		public string GameId { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Image { get; set; }
		public string Thumbnail { get; set; }

		public int? MinPlayers { get; set; }
		public int? MaxPlayers { get; set; }
		public int? PlayingTime { get; set; }
		public int? MinPlayingTime { get; set; }
		public int? MaxPlayingTime { get; set; }
		public List<string> Mechanics { get; set; }

		public bool IsExpansion { get; set; }
		public int? YearPublished { get; set; }

		public decimal? BggRating { get; set; }
		public decimal? AverageRating { get; set; }
		public int? Rank { get; set; }
		public decimal? AverageWeight { get; set; }

		public List<string> Designers { get; set; }
		public List<string> Publishers { get; set; }
		public List<string> Artists { get; set; }
		public List<BoardGameLink> Expansions { get; set; }
		public List<BoardGameLink> Expands { get; set; }

		public decimal? Rating { get; set; }
		public int NumPlays { get; set; }

		public DateTimeOffset Timestamp { get; set; }
	}


	public class BoardGameLink
	{
		public string Name { get; set; }
		public string GameId { get; set; }
	}

	public class TopTenItem
	{
		public int Rank;

		public string GameId { get; set; }
		public string Name { get; set; }
		public string Image { get; set; }
		public string Thumbnail { get; set; }

		public decimal? Rating { get; set; }
		public int NumPlays { get; set; }


		public int? YearPublished { get; set; }
		public List<string> Mechanics { get; set; }
		public List<string> Designers { get; set; }
		public string Description { get; set; }

	}

	public class CollectionStats
	{
		public int NumberOfGames { get; set; }
		public int NumberOfExpansions { get; set; }
		public int NumberOfPreviouslyOwned { get; set; }
		public int YetToBePlayed { get; set; }
		public int Preordered { get; set; }
		public int WantToBuy { get; set; }
		public decimal AverageRating { get; set; }
		public int Top100Games { get; set; }
		public int ToBePruned { get; set; }
	}

	public class PlayStats
	{
		public int NumberOfPlays { get; set; }
		public int UniqueGames { get; set; }
		public int NamedPlayers { get; set; }
		public int locations { get; set; }
		public int NewGames { get; set; }
		public int HoursPlayed { get; set; }
		public int Quarters { get; set; }
		public int Dimes { get; set; }
		public int Nickles { get; set; }
	}

	public class Stats {
		public CollectionStats Collection { get; set; }
		public PlayStats PlaysAllTime { get; set; }
		public PlayStats PlaysThisYear { get; set; }
		public int ThisYear { get; set; }
	}

}
