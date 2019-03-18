import "./App.scss";

import React, { Component, SFC } from "react";
import { Route, Switch } from "react-router";

import { IStores, createStores } from "../stores/Stores";
import StoresContext from "../stores/StoresContext";
import Home from "./home/Home";
import Layout from "./Layout";
import UnsupportedBrowser from "./UnsupportedBrowser";

let stores: IStores;
const isSupported = typeof Proxy !== "undefined" && typeof Symbol !== "undefined" && true;
if (isSupported) {
	// only create mobx stores if on a supported browser version
	stores = createStores();
}

const App: SFC = () => {
	if (isSupported) {
		return (
			<StoresContext.Provider value={stores}>
				<Layout>
					<Switch>
						<Route path="/" component={Home} />
					</Switch>
				</Layout>
			</StoresContext.Provider>
		);
	} else {
		return (
			<Layout>
				<UnsupportedBrowser />
			</Layout>
		);
	}
};

export default App;
