"use client";

import { BarCommonProps, ResponsiveBar } from "@nivo/bar";
import { CommonPieProps, ResponsivePie } from "@nivo/pie";

type Datum = {
  id: string;
  value: number;
};

interface HorizontalBarChartProps<T extends Datum> {
  data: T[];
  yLabel: string;
  colors: BarCommonProps<T>["colors"];
  labels?: boolean;
}

export function HorizontalBarChart<T extends Datum>({
  data,
  yLabel,
  colors,
  labels = false,
}: HorizontalBarChartProps<T>) {
  return (
    <ResponsiveBar
      data={data}
      keys={["value"]}
      indexBy="id"
      tooltipLabel={({ indexValue }) => indexValue as string}
      margin={{ top: 0, right: 25, bottom: 20, left: 75 }}
      padding={0.25}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      // indexScale={{ type: "band", round: true }}
      valueFormat=" >-"
      colors={colors}
      borderColor={{
        from: "color",
        modifiers: [["brighter", 2]],
      }}
      borderWidth={1}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: 5,
      }}
      axisLeft={{
        tickSize: 0,
      }}
      enableGridY={false}
      enableLabel={labels}
      legends={[]}
      role="application"
      ariaLabel={`${yLabel} bar chart`}
      barAriaLabel={function (e) {
        return `${e.id}: ${e.formattedValue} in ${yLabel}: ${e.indexValue}`;
      }}
    />
  );
}

interface PieProps<T extends Datum> {
  data: T[];
  colors: CommonPieProps<T>["colors"];
  labels?: boolean;
}

export function Pie<T extends Datum>({ data, colors, labels = false }: PieProps<T>) {
  return (
    <ResponsivePie
      data={data}
      margin={{
        top: 30,
        right: 60,
        bottom: 30,
        left: 60,
      }}
      innerRadius={0.7}
      padAngle={0}
      cornerRadius={0}
      activeOuterRadiusOffset={8}
      colors={colors}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.5]],
      }}
      enableArcLinkLabels={true}
      enableArcLabels={labels}
      arcLabel="id"
      arcLabelsRadiusOffset={0.6}
      arcLinkLabelsSkipAngle={5}
      arcLinkLabelsColor="#ccc"
      arcLinkLabelsStraightLength={8}
      arcLinkLabelsDiagonalLength={20}
      // legends={[
      //   {
      //     anchor: "right",
      //     direction: "column",
      //     justify: false,
      //     translateX: 0,
      //     translateY: 0,
      //     itemWidth: 120,
      //     itemHeight: 20,
      //     itemsSpacing: 0,
      //     symbolSize: 10,
      //     symbolBorderColor: "#333333",
      //     symbolBorderWidth: 0.5,
      //     itemDirection: "left-to-right", // symbolShape: "circle",
      //   },
      // ]}
    />
  );
}

// export default function LocationsChart({ locations }: LocationsChartProps) {
//   const colors = schemePuBu[9].slice();
//   colors.reverse();
//   // colors = colors.slice(1);
//   const data = ;

//   return <Pie colors={colors} data={getData(locations, 8, "location")}></Pie>;
// }
