import "./HomePage.css";

import { inject, observer } from "mobx-react";
import React from "react";
import Collection from "~/components/Collection";
import Loading from "~/components/Loading";
import PreorderedGames from "~/components/PreorderedGames";
import RecentPlays from "~/components/RecentPlays";
import StatsBlock from "~/components/StatsBlock";
import TopTen from "~/components/TopTen";
import UnplayedGames from "~/components/UnplayedGames";
import { Tabs, ViewStateStore } from "~/stores/ViewStateStore";

export default class HomePage extends React.Component {
  render() {
    return (
      <>
        <section className="section" id="home">
          <div className="container">
            <div className="content">
              I freely admit that I am <i>obsessed</i> with modern/designer
              board games. I have a sizable collection of games, and I add to it
              more frequently than I should. I track the games that I own and
              the games that I play on{" "}
              <a href="https://boardgamegeek.com">BoardGameGeek</a>, and this
              page chronicles my addiction.
            </div>
            <SectionTabs />
            <Loading />
          </div>
        </section>
      </>
    );
  }
}

@inject("viewStateStore")
@observer
class SectionTabs extends React.Component<{ viewStateStore?: ViewStateStore }> {
  handleTabChange = (tab: Tabs, e: any) => {
    e.preventDefault();
    this.props.viewStateStore!.changeTab(tab);
  };

  render() {
    const viewStateStore = this.props.viewStateStore!;
    const activeTab = viewStateStore.activeTab;
    if (viewStateStore.isMobile) {
      return (
        <div>
          <StatsBlock />
          <RecentPlays visible={true} />
          <TopTen visible={true} />
          <UnplayedGames visible={true} />
          <PreorderedGames visible={true} />
          <Collection visible={true} />
        </div>
      );
    } else {
      return (
        <div>
          <StatsBlock />
          <div className="tabs is-boxed is-medium">
            <ul>
              <li className={activeTab === "recentPlays" ? "is-active" : ""}>
                <a onClick={e => this.handleTabChange("recentPlays", e)}>
                  Recent Plays
                </a>
              </li>
              {/* <li className={activeTab === "mostPlays" ? "is-active" : ""}>
                <a onClick={e => this.handleTabChange("mostPlays", e)}>
                  Most Played
                </a>
              </li> */}
              <li className={activeTab === "collection" ? "is-active" : ""}>
                <a onClick={e => this.handleTabChange("collection", e)}>
                  Collection
                </a>
              </li>
              <li className={activeTab === "pending" ? "is-active" : ""}>
                <a onClick={e => this.handleTabChange("pending", e)}>
                  Unplayed / Preordered
                </a>
              </li>
              <li className={activeTab === "top10" ? "is-active" : ""}>
                <a onClick={e => this.handleTabChange("top10", e)}>Top 10</a>
              </li>
            </ul>
          </div>
          <RecentPlays visible={activeTab === "recentPlays"} />
          <TopTen visible={activeTab === "top10"} />
          <UnplayedGames visible={activeTab === "pending"} />
          <PreorderedGames visible={activeTab === "pending"} />
          <Collection visible={activeTab === "collection"} />
        </div>
      );
    }
  }
}
