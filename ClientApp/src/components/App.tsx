import "./App.scss";

import React, { Component, SFC } from "react";
import { Route, Switch } from "react-router";

import { IStores, createStores } from "../stores/Stores";
import StoresContext from "../stores/StoresContext";
import Home from "./home/Home";
import Layout from "./Layout";
import UnsupportedBrowser from "./UnsupportedBrowser";

const stores = createStores();

const App: SFC = () => {
	return (
		<StoresContext.Provider value={stores}>
			<Layout>
				<Switch>
					<Route path="/" component={Home} />
				</Switch>
			</Layout>
		</StoresContext.Provider>
	);
};

export default App;
