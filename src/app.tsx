import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { observer, Provider, inject } from 'mobx-react';
import playStore, { PlayStore } from './stores/plays-store';
import collectionStore, { CollectionStore } from './stores/collection-store';
import statsStore from './stores/stats-store';
import topTenStore from './stores/topten-store';
import uiStateStore, { UIStateStore, Tabs } from './stores/ui-state-store';
import StatsBlock from './components/stats-block';
import RecentPlays from './components/recent-plays';
import Collection from './components/collection';
import TopTen from './components/topten';
import PreorderedGames from './components/preordered-games';
import UnplayedGames from './components/unplayed-games';

useStrict(true);

const stores = {
	playStore: playStore,
	collectionStore: collectionStore,
	statsStore: statsStore,
	topTenStore: topTenStore,
	uiStateStore: uiStateStore
};

@observer
class App extends React.Component<typeof stores, {}> {
	render() {
		return (
			<Provider {...stores}>
				<div>
					<TabbedContent />
					<Loading />
				</div>
			</Provider>
		);
	}
};

@inject("uiStateStore")
@observer
class TabbedContent extends React.Component<{ uiStateStore?: UIStateStore }, {}> {

	handleTabChange = (tab: Tabs, e: any) => {
		e.preventDefault();
		this.props.uiStateStore.changeTab(tab);
	};

	render() {
		const activeTab = this.props.uiStateStore.activeTab;
		if (this.props.uiStateStore.isMobile) {
			return (
				<div>
					<StatsBlock />
					<RecentPlays visible={true} />
					<TopTen visible={true} />
					<UnplayedGames visible={true} />
					<PreorderedGames visible={true} />
					<Collection visible={true} />
				</div>
			)

		}
		else {
			return (
				<div>
					<StatsBlock />
					<div className="tabs is-boxed is-medium">
						<ul>
							<li className={activeTab == "recent" ? "is-active" : ""}><a onClick={(e) => this.handleTabChange('recent', e)}>Plays</a></li>
							<li className={activeTab == "collection" ? "is-active" : ""}><a onClick={(e) => this.handleTabChange('collection', e)}>Collection</a></li>
							<li className={activeTab == "pending" ? "is-active" : ""}><a onClick={(e) => this.handleTabChange('pending', e)}>Pending / Incoming</a></li>
							<li className={activeTab == "top10" ? "is-active" : ""}><a onClick={(e) => this.handleTabChange('top10', e)}>Top 10</a></li>
						</ul>
					</div>
					<RecentPlays visible={activeTab == "recent"} />
					<TopTen  visible={activeTab == "top10"}/>
					<UnplayedGames  visible={activeTab == "pending"}/>
					<PreorderedGames visible={activeTab == "pending"} />
					<Collection  visible={activeTab == "collection"}/>
					{/* {activeTab == "recent" ? <RecentPlays /> : null}
					{activeTab == "top10" ? <TopTen /> : null}
					{activeTab == "pending" ? <UnplayedGames /> : null}
					{activeTab == "pending" ? <PreorderedGames /> : null}
					{activeTab == "collection" ? <Collection /> : null} */}
				</div>
			)
		}

	}
}

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
