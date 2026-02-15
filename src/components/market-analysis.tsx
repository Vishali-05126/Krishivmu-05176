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

export function MarketAnalysis({ onBack }: MarketAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(true);

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
    setShowExample(false);

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
          <CardDescription>Discover the best markets to sell your produce for maximum profit.</CardDescription>
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
          
          {showExample && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Example Analysis for Tomatoes</h3>
              <p className="text-muted-foreground mb-4">This is an example of what you can expect. Fill out the form above to get personalized results.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader><CardTitle>APMC Market, Vashi</CardTitle><CardDescription>Vashi, Navi Mumbai</CardDescription></CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Profit/Trend:</strong> Prices are currently 10-12% above the state average.</p>
                    <p><strong>Contact:</strong> Rajesh Kumar - +91 98XXXXXX01</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Pune Market Yard</CardTitle><CardDescription>Gultekdi, Pune</CardDescription></CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Profit/Trend:</strong> High demand, stable prices.</p>
                    <p><strong>Contact:</strong> Priya Sharma - +91 99XXXXXX02</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Nashik Main Market</CardTitle><CardDescription>Dindori Road, Nashik</CardDescription></CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Profit/Trend:</strong> Strong export potential, prices fluctuate.</p>
                    <p><strong>Contact:</strong> Amit Patel - +91 97XXXXXX03</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}


          {!showExample && result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Top Markets</h3>
              {result.markets.length > 0 ? (
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
              ) : (
                <p className="text-muted-foreground mt-4">No markets found for the given criteria.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
