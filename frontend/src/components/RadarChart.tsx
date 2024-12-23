import { useEffect, useState } from "react";

type RadarChartItem = {
    analysis_type: string;
    analysis_count: number;
};

export default function RadarChart() {
    const [data, setData] = useState<RadarChartItem[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("https://medtech-backend-latest.onrender.com/api/radarchart/");
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
        <div>
            <h2>Radar Chart</h2>
            {history.length === 0 ? (
                <p>No data available.</p>
            ) : (
                <div>
                    {data.map((item, index) => (
                        <div key={index}>
                            <p><strong>Type:</strong> {item.analysis_type}</p>
                            <p><strong>Count:</strong> {item.analysis_count}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );    
}
