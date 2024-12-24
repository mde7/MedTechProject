import { useState } from "react";
import { postData } from "../services/apiService";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
  
 
const formSchema = z.object({
    input_sequence: z.string().min(1, {
      message: "Input Sequence must be at least 1 character.",
    }),
})

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
    const [result, setResult] = useState<ORFResult[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
              input_sequence: "",
            },
          })
        
        async function onSubmit(values: z.infer<typeof formSchema>) {
            try {
                const body = {
                    input_sequence: values.input_sequence,
                };
                const endpoint = "http://127.0.0.1:8000/api/orf-detection/";
    
                await postData({ url: endpoint, body, setResult });
            } catch (error) {
                console.error("Request failed:", error);
            }
        }

    return (
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="input_sequence"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Input Sequence</FormLabel>
                    <FormControl>
                        <Input placeholder="Sequence 1" {...field} />
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
        {result.length!=0 && (
        <Card>
            <CardHeader>
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
        )}
        </>
    );
}
