import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";
import Helmet from "react-helmet";

import StoresContext from "../../../stores/StoresContext";
import PreorderedGames from "./PreorderedGames";
import UnplayedGames from "./UnplayedGames";
import WantToBuyGames from "./WantToBuyGames";

const ComingSoon: SFC = observer(() => {
	const { statsStore } = useContext(StoresContext);

	const stats = statsStore.collectionStats;
	const description = `My board game collection is constantly growing, and there are still many games I haven't played yet. I have ${
		stats.preordered
	} games preordered, ${stats.wantToBuy} games that I want to buy, and ${stats.yetToBePlayed} I have yet to play.`;
	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
			</Helmet>
			<PreorderedGames />
			<WantToBuyGames />
			<UnplayedGames />
		</>
	);
});

export default ComingSoon;
