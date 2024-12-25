import { useEffect, useState } from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type AreaChartData = {
    date: string,
    analysis: AnalysisItem[]
};

type AnalysisItem = {
    analysis_type: string;
    analysis_count: number;
}

export default function AreaChartComponent() {
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const [analyses, setAnalyses] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/areachart/");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result: AreaChartData[] = await response.json();

                const analyses_list = Array.from(
                    new Set(result.flatMap(({ analysis }) =>
                        analysis.map((item) => item.analysis_type)
                    ))
                );
                
                setAnalyses(analyses_list);
                
                const config = {
                    total: { label: "Total" },
                    ...analyses_list.reduce((config, key, index) => {
                        config[key] = {
                            label: key,
                            color: `hsl(var(--chart-${index + 1}))`,
                        };
                        return config;
                    }, {} as ChartConfig)
                };

                setChartConfig(config);
                
                const processed = result.map(({ date, analysis }) => {
                    const analysisMap: Record<string, number> = {};
                    analysis.forEach(({ analysis_type, analysis_count }) => {
                        analysisMap[analysis_type] = analysis_count;
                    });

                    return { date, ...analysisMap };
                });

                setData(processed);
            } catch (err) {
                console.error("Failed to fetch area data:", err);
            }
        }
        fetchData();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Area Chart</CardTitle>
                <CardDescription>
                    Showing total analyses
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                <AreaChart data={data}>
                <defs>
                    {analyses.map(analysis => (
                        <linearGradient key={analysis} id={`fill${analysis}`} x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor={`var(--color-${analysis})`}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor={`var(--color-${analysis})`}
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    })
                }}
                />
                <ChartTooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                    labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        })
                    }}
                    indicator="dot"
                    />
                }
                />
                {analyses.map((analysis, index) => (
                    <Area
                    key={index}
                    dataKey={analysis}
                    type="natural"
                    fill={`url(#fill${analysis})`}
                    stroke={`var(--color-${analysis})`}
                    stackId="a"
                    />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );    
}
