'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeMarketsAction } from '@/app/actions';
import { MarketAnalysisInput, MarketAnalysisOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  crop: z.string().min(2, 'Crop name is required.'),
  location: z.string().min(2, 'Your location is required.'),
});

interface MarketAnalysisProps {
  onBack: () => void;
}

const sampleResult: MarketAnalysisOutput = {
  markets: [
    {
      marketName: 'Sample: APMC Market, Vashi',
      location: 'Navi Mumbai, Maharashtra',
      profitMargin: 'Prices are currently 10-15% above average due to high demand.',
      contact: 'Fictional Buyer: +91-9876543210'
    },
    {
      marketName: 'Sample: Lasalgaon Onion Market',
      location: 'Lasalgaon, Nashik, Maharashtra',
      profitMargin: 'Stable prices with high volume trading. Good for bulk sales.',
      contact: 'Fictional Wholesaler: +91-9123456789'
    },
    {
      marketName: 'Sample: Azadpur Mandi',
      location: 'Delhi',
      profitMargin: 'Highest profit potential but involves higher logistics costs.',
      contact: 'Fictional Trader: +91-9988776655'
    }
  ]
};

export function MarketAnalysis({ onBack }: MarketAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketAnalysisOutput | null>(sampleResult);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);

    const input: MarketAnalysisInput = values;
    const response = await analyzeMarketsAction(input);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <Card className="bg-card/80 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>Discover the best markets to sell your produce for maximum profit. Below is a sample output.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="crop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pune, Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Markets
              </Button>
            </form>
          </Form>

          {error && <p className="text-destructive mt-4">{error}</p>}

          {result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Top Markets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.markets.map((market, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{market.marketName}</CardTitle>
                      <CardDescription>{market.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Profit/Trend:</strong> {market.profitMargin}</p>
                      <p><strong>Contact:</strong> {market.contact}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
