import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { observer, Provider, inject } from 'mobx-react';
import playStore, { PlayStore } from './stores/plays-store';
import collectionStore, { CollectionStore } from './stores/collection-store';
import statsStore from './stores/stats-store';
import uiStateStore from './stores/ui-state-store';
import StatsBlock from './components/stats-block';
import RecentPlays from './components/recent-plays';
import Collection from './components/collection';
import PreorderedGames from './components/preordered-games';
import UnplayedGames from './components/unplayed-games';

useStrict(true);

const stores = {
	playStore: playStore,
	collectionStore: collectionStore,
	statsStore: statsStore,
	uiStateStore: uiStateStore
};

@observer
class App extends React.Component<typeof stores, {}> {
	render() {
		return (
			<Provider {...stores}>
				<div>
					<StatsBlock />
					{stores.playStore.isLoading || [
						<RecentPlays key="plays" />,
						<UnplayedGames key="unplayed" />,
						<PreorderedGames key="preordered" />,
						<Collection key="collection" />
					]}
					<Loading />
				</div>
			</Provider>
		);
	}
};

@inject("collectionStore", "playStore")
@observer
class Loading extends React.Component<{ collectionStore?: CollectionStore, playStore?: PlayStore }, {}> {
	render() {
		if (this.props.collectionStore.isLoading || this.props.playStore.isLoading) {
			return <div className="button is-loading"></div>
		}
		else {
			return null;
		}
	}
}

ReactDOM.render(<App {...stores} />, document.getElementById('app'));
