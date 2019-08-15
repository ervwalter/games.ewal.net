/* eslint-disable @typescript-eslint/no-unused-vars */

import "react-app-polyfill/ie9";
import "core-js";
import "regenerator-runtime/runtime";

import "./index.scss";
import "./utils/Analytics";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import UnsupportedBrowser from "./components/UnsupportedBrowser";
import analyticsTracker from "./utils/Analytics";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") || undefined;
const rootElement = document.getElementById("root");

const isSupported = typeof Proxy !== "undefined" && typeof Symbol !== "undefined" && true;
const App = React.lazy(() => import(/* webpackChunkName: "app" */ "./components/App"));

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
