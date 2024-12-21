import { useState } from "react";
import { postData } from "../services/apiService";

type ORFResult = {
    strand: string;
    frame: number;
    start: number;
    end: number;
    length: number;
    nucleotide_seq: string;
    protein_seq: string;
};

export default function ORFDetectionForm() {
    const [sequence, setSequence] = useState("");
    const [result, setResult] = useState<ORFResult[]>([]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            const body = { 
                input_sequence: sequence 
            };
            const endpoint = "http://localhost:8000/api/orf-detection/";

            await postData({ url: endpoint, body, setResult });
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>ORF Detection</h2>
            <textarea
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder="Sequence"
                required
            />
            <button type="submit">Submit</button>
            {result && (
                <div>
                    <h3>Result:</h3>
                    {result.map((res, index) => {
                        return(
                            <div key={index}>
                                <p>Strand: {res.strand}</p>
                                <p>Frame: {res.frame}</p>
                                <p>Start: {res.start}</p>
                                <p>End: {res.end}</p>
                                <p>Length: {res.length}</p>
                                <p>Nucleotide Sequence: {res.nucleotide_seq}</p>
                                <p>Protein Sequence: {res.protein_seq}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </form>
    );
}
