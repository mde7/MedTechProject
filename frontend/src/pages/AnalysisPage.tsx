import { useState } from "react";
import SequenceAlignmentForm from "../components/SequenceAlignmentForm";
import VariantDetectionForm from "../components/VariantDetectionForm";
import ORFDetectionForm from "../components/ORFDetectionForm";
import RadarChart from "../components/RadarChart";
import AreaChart from "../components/AreaChart";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export default function AnalysisPage() {
    const [analysisType, setAnalysisType] = useState<string>("");

    return (
        <div>
            <h1 className="text-3xl">Genomic Sequence Analyzer</h1>

            <div className="flex justify-center my-7">
                <Select onValueChange={(value) => setAnalysisType(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder='Analysis'/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sequence_alignment">Sequence Alignment</SelectItem>
                        <SelectItem value="variant_detection">Variant Detection</SelectItem>
                        <SelectItem value="orf_detection">ORF Detection</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="my-7 mx-7">
                {analysisType === "sequence_alignment" && <SequenceAlignmentForm/>}
                {analysisType === "variant_detection" && <VariantDetectionForm/>}
                {analysisType === "orf_detection" && <ORFDetectionForm/>}
            </div>

            <div className="grid grid-cols-2 gap-7">
                <RadarChart/>
                <AreaChart/>
            </div>
        </div>
    );
}
