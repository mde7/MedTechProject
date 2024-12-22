import { useEffect, useState } from "react";

type AnalysisHistoryItem = {
    id: number;
    analysis_type: string;
    created_at: string;
};

export default function AnalysisHistory() {
    const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch("https://medtech-backend-latest.onrender.com/api/analysis-history/");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data: AnalysisHistoryItem[] = await response.json();
                setHistory(data);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            }
        }
        fetchHistory();
    }, []);

    return (
        <div>
            <h2>Analysis History</h2>
            {history.length === 0 ? (
                <p>No analysis history available.</p>
            ) : (
                <div>
                    {history.map((item) => (
                        <div key={item.id}>
                            <p><strong>ID:</strong> {item.id}</p>
                            <p><strong>Type:</strong> {item.analysis_type}</p>
                            <p><strong>Created At:</strong> {new Date(item.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );    
}
