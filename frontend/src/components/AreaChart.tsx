import { useEffect, useState } from "react";

type AreaChartItem = {
    date: string;
    analysis: AnalysisItem[];
};

type AnalysisItem = {
    analysis_type: string;
    analysis_count: number;
}

export default function AreaChart() {
    const [data, setData] = useState<AreaChartItem[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("https://medtech-backend-latest.onrender.com/api/radarchart/");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result: AreaChartItem[] = await response.json();
                setData(result);
            } catch (err) {
                console.error("Failed to fetch radar data:", err);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h2>Radar Chart</h2>
            {data.length === 0 ? (
                <p>No data available.</p>
            ) : (
                <div>
                    {data.map((entry, index) => (
                        <div key={index}>
                            <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
                            {entry.analysis.map((item, index) => (
                                <div key={index}>
                                    <p>Analysis:{item.analysis_type}</p>
                                    <p>Count:{item.analysis_count}</p>
                                </div>
                            )
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );    
}
