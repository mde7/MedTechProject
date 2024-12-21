import { useState } from "react";
import { postData } from "../services/apiService";

export default function SequenceAlignmentForm() {
    const [sequence1, setSequence1] = useState("");
    const [sequence2, setSequence2] = useState("");
    const [result, setResult] = useState<any>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            const body = {
                reference_sequence: sequence1,
                sample_sequence: sequence2,
            };
            const endpoint = "http://localhost:8000/api/sequence-alignment/";

            await postData({ url: endpoint, body, setResult });
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sequence Alignment</h2>
            <textarea
                value={sequence1}
                onChange={(e) => setSequence1(e.target.value)}
                placeholder="Sequence 1"
                required
            />
            <textarea
                value={sequence2}
                onChange={(e) => setSequence2(e.target.value)}
                placeholder="Sequence 2"
                required
            />
            <button type="submit">Submit</button>
            {result && (
                <div>
                    <h3>Result:</h3>
                    <p>Aligned Sequence 1: {result.aligned_sequence_1}</p>
                    <p>Aligned Sequence 2: {result.aligned_sequence_2}</p>
                    <p>Alignment Score: {result.alignment_score}</p>
                </div>
            )}
        </form>
    );
}
