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
			<div className="columns is-multiline is-mobile">
				<div className={cx("column", "is-half-desktop", "is-full-tablet", "is-full-mobile", styles["chart"])}>
					<div className={styles["title"]}>Plays and Time by Month (Past 12 Months)</div>
					<ResponsiveContainer width="100%" height={200}>
						<ComposedChart data={playsByMonthStats} barSize={15} margin={{ right: 40 }}>
							<CartesianGrid stroke="#eee" />
							<Area dataKey="hoursPlayed" name="Hours" type="monotone" fill="orange" stroke="darkorange" isAnimationActive={false} />
							<Bar dataKey="numberOfPlays" name="Plays" fill="#080" isAnimationActive={true} />
							{isMobile ? <XAxis dataKey="month" tick={Tick} interval={0} height={40} /> : <XAxis dataKey="month" />}
							<YAxis width={40} />
							<Legend />
						</ComposedChart>
					</ResponsiveContainer>
				</div>
				<div className={cx("column", "is-one-quarter-desktop", "is-half-tablet", "is-full-mobile", styles["pie-days"])}>
					<div>
						<div className={styles["title"]}>Plays by Day of Week</div>
						<ResponsiveContainer width="100%" height={150}>
							<PieChart>
								<Pie
									data={playsByDayOfWeek}
									dataKey="numberOfPlays"
									innerRadius={30}
									outerRadius={50}
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
				</div>
				<div className={cx("column", "is-one-quarter-desktop", "is-half-tablet", "is-full-mobile", styles["pie-players"])}>
					<div>
						<div className={styles["title"]}>Plays by Player Count</div>
						<ResponsiveContainer width="100%" height={150}>
							<PieChart>
								<Pie
									data={playsByPlayerCount}
									dataKey="numberOfPlays"
									outerRadius={50}
									innerRadius={30}
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

const labelPercentLimit = 0.025;

const PieLabelLine: SFC<any> = props => {
	if (props.percent < labelPercentLimit) {
		return null;
	}
	const points = [
		polarToCartesian(props.cx, props.cy, props.outerRadius, props.midAngle),
		polarToCartesian(props.cx, props.cy, props.outerRadius + 10, props.midAngle)
	];
	return <Curve {...props} points={points} type="linear" stroke="#aaa" />;
};

const DaysOfWeekLabel: SFC<any> = props => <PieLabel dataKey="day" {...props} />;
const PlayerCountLabel: SFC<any> = props => <PieLabel dataKey="playerCount" {...props} />;

const PieLabel: SFC<any> = ({ dataKey, ...props }) => {
	const cx = props.cx as number;
	const cy = props.cy as number;
	const midAngle = props.midAngle as number;
	const outerRadius = props.outerRadius as number;
	const percent = props.percent as number;
	const payload = props.payload;

	if (percent < labelPercentLimit) {
		return null;
	}

	const { x, y } = polarToCartesian(cx, cy, outerRadius + 18, midAngle);
	return (
		<text x={x} y={y} fill="#666" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
			{payload[dataKey]}
		</text>
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
