import cx from "classnames";
import color from "color";
import rainbow from "color-rainbow";
import { observer } from "mobx-react-lite";
import moment from "moment";
import numeral from "numeral";
import React, { SFC, useContext } from "react";
import Helmet from "react-helmet";
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Curve, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import StoresContext from "../../../stores/StoresContext";
import styles from "./StatsBlock.module.scss";

const StatsBlock: SFC = observer(() => {
	const { statsStore, viewStateStore } = useContext(StoresContext);
	const { collectionStats, thirtyDaysStats, thisYearStats, allTimeStats, playsByMonthStats, playsByDayOfWeek, playsByPlayerCount } = statsStore;

	const isMobile = viewStateStore.isMobile;

	const description = `I own ${collectionStats.numberOfGames} games and ${collectionStats.numberOfExpansions} expansions. I have played games ${
		thisYearStats.numberOfPlays
	} times this year and ${allTimeStats.numberOfPlays} times all-time for a cumulative ${numeral(thisYearStats.hoursPlayed).format(
		"0"
	)} hours this year and ${numeral(allTimeStats.hoursPlayed).format("0")} hours all-time. I played ${thisYearStats.uniqueGames} unique games this year and ${
		allTimeStats.uniqueGames
	} unique games all-time.`;

	const darkenFactor = 0.15;
	const daysOfWeekColors = rotate(rainbow.create(playsByDayOfWeek.length), Math.round(playsByDayOfWeek.length * 0.5)).map(c =>
		color(c.hexString()).darken(darkenFactor)
	);
	const playerCountColors = rotate(rainbow.create(playsByPlayerCount.length), Math.round(playsByPlayerCount.length * 0.5)).map(c =>
		color(c.hexString()).darken(darkenFactor)
	);

	const chartDataAvailable = playsByDayOfWeek.length > 0 && playsByDayOfWeek.length > 0 && playsByPlayerCount.length > 0;

	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
			</Helmet>
			<div className={styles["stats"]}>
				<div className="title">Statistics</div>
				<div className="columns is-multiline is-mobile">
					<div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
						<small>COLLECTION</small>
						<br />
						<b>{collectionStats.numberOfGames}</b> games<span className="is-hidden-mobile"> owned</span>
						<br />
						<b>{collectionStats.numberOfExpansions}</b> expansions
						<span className="is-hidden-mobile"> owned</span>
						<br />
						<b>{collectionStats.numberOfPreviouslyOwned}</b> prev
						<span className="is-hidden-mobile">iously</span> owned
						<span className="is-hidden-mobile"> games</span>
						<br />
						<b>{collectionStats.yetToBePlayed}</b>
						<span className="is-hidden-tablet"> unplayed</span>
						<span className="is-hidden-mobile"> games yet to be played</span>
						<br />
						<b>{collectionStats.preordered}</b> preorded<span className="is-hidden-mobile"> games</span>
						<br />
						<b>{collectionStats.top100Games}</b>
						<span className="is-hidden-mobile"> games from the BGG</span> top 100
						<br />
						<b>{collectionStats.averageRating === "..." ? "..." : numeral(collectionStats.averageRating).format("0.0")}</b>
						<span className="is-hidden-tablet"> avg rating</span>
						<span className="is-hidden-mobile"> average rating</span>
						<br />
					</div>
					<div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
						<small>PLAYS</small>
						<br />
						<b>{allTimeStats.numberOfPlays}</b> plays
						<br />
						<b>{allTimeStats.uniqueGames}</b> unique games
						<br />
						<b>{allTimeStats.hoursPlayed}</b> hours<span className="is-hidden-mobile"> played</span>
						<br />
						<b>{allTimeStats.nickles}</b> nickels<span className="is-hidden-mobile"> (5+ plays)</span>
						<br />
						<b>{allTimeStats.dimes}</b> dimes<span className="is-hidden-mobile"> (10+ plays)</span>
						<br />
						<b>{allTimeStats.quarters}</b> quarters<span className="is-hidden-mobile"> (25+ plays)</span>
						<br />
						<b>{allTimeStats.hIndex}</b> H-index
						<br />
					</div>
					<div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
						<small>{moment().format("YYYY")} YEAR TO DATE</small>
						<br />
						<b>{thisYearStats.numberOfPlays}</b> plays
						<br />
						<b>{thisYearStats.uniqueGames}</b> unique games
						<br />
						<b>{thisYearStats.namedPlayers}</b> named players
						<br />
						<b>{thisYearStats.locations}</b> locations
						<br />
						<b>{thisYearStats.newGames}</b> new games
						<br />
						<b>{thisYearStats.hoursPlayed}</b> hours<span className="is-hidden-mobile"> played</span>
						<br />
					</div>
					<div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
						<small>LAST 30 DAYS</small>
						<br />
						<b>{thirtyDaysStats.numberOfPlays}</b> plays
						<br />
						<b>{thirtyDaysStats.uniqueGames}</b> unique games
						<br />
						<b>{thirtyDaysStats.namedPlayers}</b> named players
						<br />
						<b>{thirtyDaysStats.locations}</b> locations
						<br />
						<b>{thirtyDaysStats.newGames}</b> new games
						<br />
						<b>{thirtyDaysStats.hoursPlayed}</b> hours<span className="is-hidden-mobile"> played</span>
						<br />
					</div>
				</div>
			</div>
			{chartDataAvailable && (
				<div className="columns is-multiline is-mobile">
					<div className={cx("column", "is-half-desktop", "is-full-tablet", "is-full-mobile", styles["chart"])}>
						<div className={styles["title"]}>Plays and Time by Month (Past 12 Months)</div>
						<ResponsiveContainer width="100%" height={isMobile ? 210 : 230}>
							<ComposedChart data={playsByMonthStats} barSize={isMobile ? 15 : 30} margin={{ right: 40, top: 20, bottom: 20 }}>
								<CartesianGrid stroke="#eee" vertical={false} />
								<Area dataKey="hoursPlayed" name="Hours" type="monotone" fill="orange" stroke="darkorange" isAnimationActive={false} />
								<Bar dataKey="numberOfPlays" name="Plays" fill="#080" isAnimationActive={false} />
								{isMobile ? <XAxis dataKey="month" tick={Tick} interval={0} height={40} /> : <XAxis dataKey="month" />}
								<YAxis width={40} interval={0} />
								<Legend />
							</ComposedChart>
						</ResponsiveContainer>
					</div>
					<div className={cx("column", "is-half-desktop", "is-full-tablet", "is-full-mobile", styles["pie"])}>
						<div>
							<div className={styles["title"]}>Plays by Day of Week</div>
							<ResponsiveContainer width="100%" height={180}>
								<PieChart margin={{ top: 20, bottom: 20 }}>
									<Pie
										data={playsByDayOfWeek}
										dataKey="numberOfPlays"
										outerRadius={60}
										innerRadius={20}
										startAngle={-270}
										endAngle={-630}
										label={DaysOfWeekLabel}
										labelLine={PieLabelLine}
										// labelLine={false}
										isAnimationActive={false}>
										{playsByDayOfWeek.map((entry, index) => (
											<Cell key={index} fill={daysOfWeekColors[index].hex()} />
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</div>
						{/* </div>
					<div className={cx("column", "is-one-quarter-desktop", "is-half-tablet", "is-full-mobile", styles["pie-players"])}> */}
						<div>
							<div className={styles["title"]}>Plays by Player Count</div>
							<ResponsiveContainer width="100%" height={180}>
								<PieChart margin={{ top: 20, bottom: 20 }}>
									<Pie
										data={playsByPlayerCount}
										dataKey="numberOfPlays"
										outerRadius={60}
										innerRadius={20}
										startAngle={-270}
										endAngle={-630}
										label={PlayerCountLabel}
										labelLine={PieLabelLine}
										// labelLine={false}
										isAnimationActive={false}>
										{playsByPlayerCount.map((entry, index) => (
											<Cell key={index} fill={playerCountColors[index].hex()} />
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			)}
		</>
	);
});

const Tick: SFC<{ payload: any; x: number; y: number }> = ({ x, y, payload }) => {
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={0} y={0} dy={8} dx={0} textAnchor="end" fill="#666" transform="rotate(-60)">
				{payload.value}
			</text>
		</g>
	);
};

const labelPercentLimit = 0.05;

const PieLabelLine: SFC<any> = props => {
	const { cx, cy, midAngle, outerRadius, percent } = props;

	if (percent < labelPercentLimit) {
		return null;
	}

	const points = [polarToCartesian(cx, cy, outerRadius, midAngle), polarToCartesian(cx, cy, outerRadius + 10, midAngle)];

	return <Curve {...props} points={points} type="linear" stroke="#aaa" />;
};

const DaysOfWeekLabel: SFC<any> = props => <PieLabel dataKey="day" {...props} />;
const PlayerCountLabel: SFC<any> = props => <PieLabel dataKey="playerCount" {...props} />;

const PieLabel: SFC<any> = ({ dataKey, ...props }) => {
	const { cx, cy, midAngle, outerRadius, innerRadius, percent, payload } = props;

	if (percent < labelPercentLimit) {
		return null;
	}

	const { x: outsideX, y: outsideY } = polarToCartesian(cx, cy, outerRadius + 20, midAngle);
	const { x: insideX, y: insideY } = polarToCartesian(cx, cy, (outerRadius - innerRadius) / 2 + innerRadius, midAngle);

	return (
		<>
			<text x={outsideX} y={outsideY} className={styles["label"]} textAnchor={outsideX > cx ? "start" : "end"} dominantBaseline="middle">
				{payload[dataKey]}
			</text>
			<text x={insideX} y={insideY} className={styles["percent"]} textAnchor="middle" dominantBaseline="middle">
				{`${numeral(percent * 100).format("0")}%`}
			</text>
		</>
	);
};

const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => ({
	x: cx + Math.cos(-Radian * angle) * radius,
	y: cy + Math.sin(-Radian * angle) * radius
});

const rotate = (array: any[], n: number) => {
	return array.slice(n, array.length).concat(array.slice(0, n));
};

const Radian = Math.PI / 180;

export default StatsBlock;
