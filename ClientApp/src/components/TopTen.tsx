import { inject, observer } from "mobx-react";
import * as React from "react";
import { TopTenItem, TopTenStore } from "~/stores/TopTenStore";
import { ViewStateStore } from "~/stores/ViewStateStore";

@inject("topTenStore", "viewStateStore")
@observer
export default class TopTen extends React.Component<{
  topTenStore?: TopTenStore;
  viewStateStore?: ViewStateStore;
  visible: boolean;
}> {
  render() {
    if (this.props.topTenStore!.games.length === 0) {
      return null;
    }
    let className = "subsection";
    if (!this.props.visible) {
      className += " hidden";
    }
    return (
      <div className={className}>
        <div className="title is-4">Top 10 Favorite Games</div>
        {this.props.viewStateStore!.isMobile ? (
          <TopTenMobileTable games={this.props.topTenStore!.games} />
        ) : (
          <TopTenList games={this.props.topTenStore!.games} />
        )}
      </div>
    );
  }
}

class TopTenList extends React.Component<{ games: TopTenItem[] }, {}> {
  render() {
    return (
      <div className="topten">
        {this.props.games.map(game => (
          <TopTenEntry game={game} key={game.gameId} />
        ))}
      </div>
    );
  }
}

class TopTenEntry extends React.Component<{ game: TopTenItem }, {}> {
  render() {
    const game = this.props.game;
    return (
      <div className="columns">
        <div className="column is-narrow rank">
          <span className="">
            #<b>{game.rank}</b>
          </span>
        </div>
        <div className="column is-narrow thumbnail">
          <img src={game.thumbnail.replace("_t.", "_t.")} />
        </div>
        <div className="column">
          <div className="content topten-content">
            <p>
              <span className="topten-title">
                <a
                  className="name"
                  target="_blank"
                  href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
                >
                  {game.name}
                </a>{" "}
                ({game.yearPublished})
              </span>
              <span className="topten-subtitle">
                <PlayCount plays={game.numPlays} /> • Rating:{" "}
                <RatingStars rating={game.rating} /> • Designed By:{" "}
                <span className="designers">{game.designers.join(", ")}</span>{" "}
              </span>
              <span className="mechanics">{game.mechanics.join(" • ")}</span>
            </p>
            <p className="description">{game.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

class TopTenMobileTable extends React.Component<{ games: TopTenItem[] }, {}> {
  render() {
    return (
      <div className="topten-mobile">
        <table className="table is-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th className="rating">Rating</th>
            </tr>
          </thead>
          <tbody>
            {this.props.games.map(game => (
              <TopTenMobileRow game={game} key={game.gameId} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

class TopTenMobileRow extends React.Component<{ game: TopTenItem }, {}> {
  render() {
    const game = this.props.game;
    return (
      <tr>
        <td className="rank">#{game.rank}</td>
        <td className="name">
          <a
            target="_blank"
            href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
          >
            {game.name}
          </a>
        </td>
        <td className="rating">
          <Rating rating={game.rating} />
        </td>
      </tr>
    );
  }
}

class PlayCount extends React.Component<{ plays: number }, {}> {
  render() {
    if (this.props.plays > 0) {
      return (
        <span>
          Played <b>{this.props.plays}</b> time{this.props.plays > 1 ? "s" : ""}
        </span>
      );
    } else {
      return <span>—</span>;
    }
  }
}

@inject("viewStateStore")
@observer
class Rating extends React.Component<{
  rating?: number;
  viewStateStore?: ViewStateStore;
}> {
  render() {
    const rating = this.props.rating;
    if (rating) {
      return <RatingNumber rating={rating} />;
    } else {
      return <span>—</span>;
    }
  }
}

class RatingNumber extends React.Component<{ rating: number }, {}> {
  render() {
    return <span>{this.props.rating}</span>;
  }
}

class RatingStars extends React.Component<{ rating?: number }, {}> {
  render() {
    return (
      <span className="stars-container">
        <span className="stars-background is-flex">
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
          <i className="fa fa-star-o" aria-hidden="true" />
        </span>
        {this.props.rating && (
          <span
            className="stars-foreground is-flex"
            style={{ width: `${this.props.rating * 10}%` }}
          >
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
            <i className="fa fa-star" aria-hidden="true" />
          </span>
        )}
      </span>
    );
  }
}
