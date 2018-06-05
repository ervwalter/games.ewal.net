import "./App.css";

import { configure } from "mobx";
import { Provider } from "mobx-react";
import React from "react";
import HomePage from "~/components/HomePage";
import { CollectionStore } from "~/stores/CollectionStore";
import { PlayStore } from "~/stores/PlayStore";
import { StatsStore } from "~/stores/StatsStore";
import { TopTenStore } from "~/stores/TopTenStore";
import { ViewStateStore } from "~/stores/ViewStateStore";

configure({ enforceActions: true });

const playStore = new PlayStore();
const collectionStore = new CollectionStore();
const statsStore = new StatsStore(playStore, collectionStore);
const topTenStore = new TopTenStore();
const viewStateStore = new ViewStateStore();

const stores = {
  playStore,
  collectionStore,
  statsStore,
  topTenStore,
  viewStateStore
};

export default class App extends React.Component {
  public render() {
    return (
      <Provider {...stores}>
        <>
          <nav className="navbar" id="masthead">
            <div className="container">
              <div className="navbar-brand">
                <div className="navbar-item">
                  <div className="logo">
                    <span className="slashes">{"// "}</span>
                    <a href="https://blog.ewal.net">Ewal.net</a>
                  </div>
                  <div className="description is-hidden-mobile">
                    Chronicles of a board game addict...
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <HomePage />
        </>
      </Provider>
    );
  }
}
