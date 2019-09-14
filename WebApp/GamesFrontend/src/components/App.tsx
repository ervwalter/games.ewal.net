import "./App.scss";

import React, { SFC } from "react";
import { Route, Switch } from "react-router";

import { createStores } from "../stores/Stores";
import StoresContext from "../stores/StoresContext";
import Home from "./home/Home";
import Layout from "./Layout";
import WantToPrune from "./prune/WantToPrune";

const stores = createStores();

const App: SFC = () => {
	return (
		<StoresContext.Provider value={stores}>
			<Layout>
				<Switch>
					<Route path="/prune" exact={true} component={WantToPrune} />
					<Route path="/:section?" component={Home} />
				</Switch>
			</Layout>
		</StoresContext.Provider>
	);
};

export default App;
