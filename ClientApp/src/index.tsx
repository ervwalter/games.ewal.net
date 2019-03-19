import "react-app-polyfill/ie9";
import "@babel/polyfill";

import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";
import Layout from "./components/Layout";
import UnsupportedBrowser from "./components/UnsupportedBrowser";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") || undefined;
const rootElement = document.getElementById("root");

const isSupported = typeof Proxy !== "undefined" && typeof Symbol !== "undefined" && true;

if (isSupported) {
	ReactDOM.render(
		<BrowserRouter basename={baseUrl}>
			<App />
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
