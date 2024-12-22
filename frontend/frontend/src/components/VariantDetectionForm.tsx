import { useState } from "react";
import { postData } from "../services/apiService";

type ORFVariants = {
    type: string;
    position: number;
    reference_base: string;
    sample_base: string;
}

type ORFResult = {
    aligned_reference: string;
    aligned_sample: string;
    variants: ORFVariants[];
};

export default function VarianceDetectionForm() {
    const [sequence1, setSequence1] = useState("");
    const [sequence2, setSequence2] = useState("");
    const [result, setResult] = useState<ORFResult | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            const body = {
                reference_sequence: sequence1,
                sample_sequence: sequence2,
            };
            const endpoint = "https://medtech-backend-latest.onrender.com/api/variant-detection/";

            await postData({ url: endpoint, body, setResult });
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Variance Detection</h2>
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
                    <p>Aligned Reference: {result.aligned_reference}</p>
                    <p>Aligned Sample: {result.aligned_sample}</p>
                    <p>Variants</p>
                    {result.variants.map((variant, index) => {
                        return(
                            <div key={index}>
                                <p>Type: {variant.type}</p>
                                <p>Position: {variant.position}</p>
                                <p>Reference Base: {variant.reference_base}</p>
                                <p>Sample Base: {variant.sample_base}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </form>
    );
}
