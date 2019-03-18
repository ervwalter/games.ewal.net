import "react-app-polyfill/ie11";

import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") || undefined;
const rootElement = document.getElementById("root");

ReactDOM.render(
	<BrowserRouter basename={baseUrl}>
		<App />
	</BrowserRouter>,
	rootElement
);
