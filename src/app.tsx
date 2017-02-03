import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {useStrict} from 'mobx';
import {observer, Provider} from 'mobx-react';
import playStore  from './stores/plays-store';
import collectionStore from './stores/collection-store';
import statsStore from './stores/stats-store';
import uiStateStore from './stores/ui-state-store';
import StatsBlock from './components/stats-block';
import RecentPlays from './components/recent-plays';
import Collection from './components/collection';

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
					{stores.playStore.isLoading ? <Loading /> : [
						<RecentPlays key="plays"/>,
						<Collection key="collection"/>
					]}
				</div>
			</Provider>
		);
	}
};

class Loading extends React.Component<undefined, undefined> {
	render() {
		return <div className="button is-loading"></div>
	}
}

ReactDOM.render(<App {...stores} />, document.getElementById('app'));
