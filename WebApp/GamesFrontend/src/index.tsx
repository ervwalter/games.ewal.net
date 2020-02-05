/* eslint-disable @typescript-eslint/no-unused-vars */

import "react-app-polyfill/ie9";
import "core-js";
import "regenerator-runtime/runtime";

import "./index.scss";

import axios from "axios";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { analytics } from "spa-analytics-wrapper";

import Layout from "./components/Layout";
import UnsupportedBrowser from "./components/UnsupportedBrowser";
import lazy from "./utils/Lazy";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") || undefined;
const rootElement = document.getElementById("root");

const isSupported = typeof Proxy !== "undefined" && typeof Symbol !== "undefined" && true;
const App = lazy(() => import(/* webpackChunkName: "app" */ "./components/App"));

if (process.env.NODE_ENV === "development") {
	axios.defaults.baseURL = "https://games.ewal.net/";
} else {
	axios.defaults.baseURL = "/";
}

analytics.init({
	gaugesIdentifier: "58825bfcc88d9013770c8cf7",
	matomoIdentifier: {
		hostname: "matomo.ewal.net",
		siteId: "games.ewal.net"
	},
	sentryDSN: "https://fa2b74a3356e44ae949f9bf9938fdbc0@sentry.io/1531751"
});

if (isSupported) {
	ReactDOM.render(
		<BrowserRouter basename={baseUrl}>
			<Suspense fallback={null}>
				<App />
			</Suspense>
		</BrowserRouter>,
		rootElement
	);
} else {
	ReactDOM.render(
		<Layout>
			<UnsupportedBrowser />
		</Layout>,
		rootElement
	);
}
