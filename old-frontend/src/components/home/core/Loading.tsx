import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import styles from "./Loading.module.scss";

const Loading: SFC = observer(() => {
	const { collectionStore, playStore, topTenStore } = useContext(StoresContext);

	if (collectionStore.isLoading || playStore.isLoading || topTenStore.isLoading || false) {
		return <div className={cx("button", "is-loading", styles["loading"])} />;
	} else {
		return null;
	}
});

export default Loading;
