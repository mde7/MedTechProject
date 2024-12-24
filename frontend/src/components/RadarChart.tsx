import { useEffect, useState } from "react";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    desktop: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

type RadarChartItem = {
    analysis_type: string;
    analysis_count: number;
};

export default function RadarChartComponent() {
    const [data, setData] = useState<RadarChartItem[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/radarchart/");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result: RadarChartItem[] = await response.json();
                setData(result);
            } catch (err) {
                console.error("Failed to fetch radar data:", err);
            }
        }
        fetchData();
    }, []);

    return (
        <Card>
            <CardHeader>
            <CardTitle>Radar Chart</CardTitle>
            <CardDescription>
                Showing total analyses performed
            </CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer
                config={chartConfig}
            >
                <RadarChart data={data}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey="analysis_type" />
                <PolarGrid />
                <Radar
                    dataKey="analysis_count"
                    fill="var(--color-desktop)"
                    fillOpacity={0.6}
                />
                </RadarChart>
            </ChartContainer>
            </CardContent>
        </Card>
    );    
}