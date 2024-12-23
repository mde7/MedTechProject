import { useState } from "react";
import SequenceAlignmentForm from "../components/SequenceAlignmentForm";
import VariantDetectionForm from "../components/VariantDetectionForm";
import ORFDetectionForm from "../components/ORFDetectionForm";
import RadarChart from "../components/RadarChart";
import AreaChart from "../components/AreaChart";

export default function AnalysisPage() {
    const [analysisType, setAnalysisType] = useState<string>("sequence_alignment");

    return (
        <div>
            <h1>DNA Sequence Analyzer</h1>

            {/* Select Analysis Type */}
            <select value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
                <option value="sequence_alignment">Sequence Alignment</option>
                <option value="variant_detection">Variance Detection</option>
                <option value="orf_detection">ORF Detection</option>
            </select>

            {/* Render Form Dynamically */}
            {analysisType === "sequence_alignment" && <SequenceAlignmentForm/>}
            {analysisType === "variant_detection" && <VariantDetectionForm/>}
            {analysisType === "orf_detection" && <ORFDetectionForm/>}

            <hr/>
            <RadarChart/>
            <hr/>
            <AreaChart/>
        </div>
    );
}
