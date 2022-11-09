"use client";

import { CommonPieProps, ResponsivePie } from "@nivo/pie";

type Datum = {
  id: string;
  value: number;
};

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
        top: 20,
        right: 40,
        bottom: 20,
        left: 40,
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
      arcLinkLabelsSkipAngle={15}
      arcLinkLabelsColor="#ccc"
      arcLinkLabelsStraightLength={8}
      arcLinkLabelsDiagonalLength={15}
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
