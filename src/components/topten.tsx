import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { TopTenStore, TopTenItem } from '../stores/topten-store';
import { UIStateStore } from '../stores/ui-state-store';


// @inject("uiStateStore")
// @observer
// class Rating extends React.Component<{ rating: number, uiStateStore?: UIStateStore }, {}> {

@inject("topTenStore")
@observer
export default class ToPTen extends React.Component<{ topTenStore?: TopTenStore }, {}> {
    render() {
        if (this.props.topTenStore.games.length == 0) {
            return null;
        }
        return (
            <div className="subsection">
                <div className="title is-4">
                    Top 10 Games
                </div>
                <TopTenTable games={this.props.topTenStore.games} />
            </div>
        )
    }
};

class TopTenTable extends React.Component<{ games: TopTenItem[] }, {}> {
    render() {
        return (
            <div className="topten">
                <table className="table is-striped">
                    <thead><tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th className="rating">Rating</th>
                    </tr></thead>
                    <tbody>
                        {this.props.games.map(game => <TopTenRow game={game} key={game.gameId} />)}
                    </tbody>
                </table>
            </div>
        );
    }
}

class TopTenRow extends React.Component<{ game: TopTenItem }, {}> {
    render() {
        let game = this.props.game;
        return (
            <tr>
                <td className="rank">#{game.rank}</td>
                <td className="name">
                    <a target="_blank" href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}>{game.name}</a>
                </td>
                <td className="rating"><Rating rating={game.rating} /></td>
            </tr>
        )
    }
}

// class PlayCount extends React.Component<{ plays: number }, {}> {
//     render() {
//         if (this.props.plays > 0) {
//             return (
//                 <span>
//                     <span className="is-hidden-mobile">Played </span><b>{this.props.plays}</b> time{this.props.plays > 1 ? 's' : ''}
//                 </span>
//             );
//         }
//         else {
//             return <span>—</span>;
//         }
//     }
// }

@inject("uiStateStore")
@observer
class Rating extends React.Component<{ rating: number, uiStateStore?: UIStateStore }, {}> {
    render() {
        if (this.props.rating > 0) {
            return <RatingNumber rating={this.props.rating} />;
        }
        else {
            return <span>—</span>;
        }
    }
}

class RatingNumber extends React.Component<{ rating: number }, {}> {
    render() {
        return <span>{this.props.rating}</span>
    }
}


// class RatingStars extends React.Component<{ rating: number }, {}> {
//     render() {
//         return (
//             <span className="stars-container">
//                 <span className="stars-background is-flex">
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                     <i className="fa fa-star-o" aria-hidden="true"></i>
//                 </span>
//                 <span className="stars-foreground is-flex" style={{ width: `${this.props.rating * 10}%` }}>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                     <i className="fa fa-star" aria-hidden="true"></i>
//                 </span>
//             </span>
//         )
//     }
// }
