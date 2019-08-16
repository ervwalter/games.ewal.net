/* eslint-disable @typescript-eslint/no-unused-vars */

import "react-app-polyfill/ie9";
import "core-js";
import "regenerator-runtime/runtime";

import "./index.scss";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import UnsupportedBrowser from "./components/UnsupportedBrowser";
import tracker from "./utils/Analytics";
import analyticsTracker from "./utils/Analytics";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") || undefined;
const rootElement = document.getElementById("root");

const isSupported = typeof Proxy !== "undefined" && typeof Symbol !== "undefined" && true;
const App = React.lazy(() => import(/* webpackChunkName: "app" */ "./components/App"));

let commitHash = (process && process.env && process.env.REACT_APP_COMMIT) || undefined;
let buildId = (process && process.env && process.env.REACT_APP_BUILD_ID) || undefined;
let version;
if (commitHash && buildId) {
	version = `trendweight-${buildId}-${commitHash.substr(0, 7)}`;
} else {
	version = "trendweight-dev";
}

tracker.init({
	gaugesIdentifier: "5c94e5859482cb34c9ee7690",
	ostrioIdendifier: "68bCGRQxE8hcjya6P",
	sentryDSN: "https://fa2b74a3356e44ae949f9bf9938fdbc0@sentry.io/1531751",
	sentryRelease: version
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
