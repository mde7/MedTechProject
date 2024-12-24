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
    reference_sequence: z.string().min(1, {
      message: "Input Sequence 1 must be at least 1 character.",
    }),
    sample_sequence: z.string().min(1, {
        message: "Input Sequence 2 must be at least 1 character.",
    }),
})

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
    const [result, setResult] = useState<ORFResult | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          reference_sequence: "",
          sample_sequence: "",
        },
      })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const body = {
                reference_sequence: values.reference_sequence,
                sample_sequence: values.sample_sequence,
            };
            const endpoint = "http://127.0.0.1:8000/api/variant-detection/";

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
                name="reference_sequence"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Reference Sequence</FormLabel>
                    <FormControl>
                        <Input placeholder="Sequence 1" {...field} />
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="sample_sequence"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Sample Sequence</FormLabel>
                    <FormControl>
                        <Input placeholder="Sequence 2" {...field}/>
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
        {result && (
        <Card>
            <CardHeader>
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Aligned Reference: {result.aligned_reference}</p>
                <p>Aligned Sample: {result.aligned_sample}</p>
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
            </CardContent>
        </Card>
        )}
        </>
    );
}