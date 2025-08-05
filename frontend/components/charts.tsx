"use client";

import { BarCommonProps, BarDatum, ResponsiveBar } from "@nivo/bar";
import { CommonPieProps, MayHaveLabel, ResponsivePie } from "@nivo/pie";

interface PieDatum extends MayHaveLabel {
  id: string;
  value: number;
}

interface HorizontalBarChartProps<T extends BarDatum> {
  data: T[];
  axisLabel: string;
  colors: BarCommonProps<T>["colors"];
  showLabels?: boolean;
}

export function HorizontalBarChart<T extends BarDatum>({
  data,
  axisLabel,
  colors,
  showLabels = false,
}: HorizontalBarChartProps<T>) {
  return (
    <ResponsiveBar
      data={data}
      keys={["value"]}
      indexBy="id"
      tooltipLabel={({ indexValue }) => indexValue as string}
      margin={{ top: 0, right: 25, bottom: 20, left: 65 }}
      padding={0.25}
      groupMode="grouped"
      layout="horizontal"
      valueScale={{ type: "linear" }}
      valueFormat=" >-"
      colors={colors}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.5]],
      }}
      borderWidth={1}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: 6,
      }}
      axisLeft={{
        tickSize: 0,
      }}
      enableGridX={true}
      gridXValues={6}
      enableGridY={false}
      enableLabel={showLabels}
      labelTextColor={{ from: "color", modifiers: [["brighter", 3]] }}
      legends={[]}
      role="application"
      ariaLabel={`${axisLabel} bar chart`}
      barAriaLabel={function (e) {
        return `${e.id}: ${e.formattedValue} in ${axisLabel}: ${e.indexValue}`;
      }}
    />
  );
}

interface PieProps<T extends PieDatum> {
  data: T[];
  colors: CommonPieProps<T>["colors"];
  showLabels?: boolean;
}

export function PieChart<T extends PieDatum>({ data, colors, showLabels = false }: PieProps<T>) {
  console.log('PieChart render:', { data: data?.length, colors, showLabels });
  
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;
  }

  return (
    <ResponsivePie
      data={data}
      margin={{
        top: 35,
        right: 40,
        bottom: 35,
        left: 40,
      }}
      innerRadius={0.7}
      padAngle={3.5}
      cornerRadius={0}
      activeOuterRadiusOffset={8}
      colors={colors}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.5]],
      }}
      enableArcLinkLabels={true}
      enableArcLabels={showLabels}
      arcLabel="id"
      arcLabelsRadiusOffset={0.6}
      arcLinkLabelsSkipAngle={12}
      arcLinkLabelsColor="#ccc"
      arcLinkLabelsStraightLength={8}
      arcLinkLabelsDiagonalLength={20}
    />
  );
}
