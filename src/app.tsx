import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {useStrict} from 'mobx';
import {observer, Provider} from 'mobx-react';
import playStore  from './stores/plays-store';
import collectionStore from './stores/collection-store';
import statsStore from './stores/stats-store';
import StatsBlock from './components/stats-block';

useStrict(true);

const stores = {
	playStore: playStore,
	collectionStore: collectionStore,
	statsStore: statsStore
};

@observer
class App extends React.Component<typeof stores, {}> {
	render() {
		return (
			<Provider {...stores}>
				<StatsBlock />
			</Provider>
		);
	}
};

ReactDOM.render(<App {...stores} />, document.getElementById('app'));
