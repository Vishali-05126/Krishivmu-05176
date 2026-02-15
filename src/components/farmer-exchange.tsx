'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { findExchangeMatchesAction } from '@/app/actions';
import { FarmerExchangeInput, FarmerExchangeOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  haveCrop: z.string().min(2, 'Crop you have is required.'),
  wantCrop: z.string().min(2, 'Crop you want is required.'),
  location: z.string().min(2, 'Your location is required.'),
});

interface FarmerExchangeProps {
  onBack: () => void;
}

export function FarmerExchange({ onBack }: FarmerExchangeProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FarmerExchangeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      haveCrop: '',
      wantCrop: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    setShowExample(false);

    const input: FarmerExchangeInput = values;
    const response = await findExchangeMatchesAction(input);

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
          <CardTitle>Farmer to Farmer Exchange</CardTitle>
          <CardDescription>Find other farmers to exchange or barter crops with.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="haveCrop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop You Have</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wheat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wantCrop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop You Want</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Rice" {...field} />
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
                Find Matches
              </Button>
            </form>
          </Form>

          {error && <p className="text-destructive mt-4">{error}</p>}
          
          {showExample && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Example Matches</h3>
               <p className="text-muted-foreground mb-4">This is an example of what you can expect. Fill out the form above to get personalized results.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                  <CardHeader><CardTitle>Sanjay Patil</CardTitle><CardDescription>Near Baramati, Maharashtra</CardDescription></CardHeader>
                  <CardContent className="space-y-2">
                    <p>Has 5 tons of high-quality onions, wants 4 tons of Jowar (Sorghum).</p>
                    <p><strong>Contact:</strong> +91 99XXXXXX02</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Anita Rao</CardTitle><CardDescription>Near Nashik, Maharashtra</CardDescription></CardHeader>
                  <CardContent className="space-y-2">
                    <p>Has 10 tons of grapes, wants 8 tons of wheat.</p>
                    <p><strong>Contact:</strong> +91 98XXXXXX03</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader><CardTitle>Vikram Singh</CardTitle><CardDescription>Near Ahmednagar, Maharashtra</CardDescription></CardHeader>
                  <CardContent className="space-y-2">
                    <p>Has 2 tons of pomegranates, wants 1.5 tons of soybeans.</p>
                    <p><strong>Contact:</strong> +91 97XXXXXX04</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!showExample && result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Potential Matches</h3>
              {result.matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.matches.map((match, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{match.farmerName}</CardTitle>
                        <CardDescription>{match.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                         <p>{match.exchangeDetails}</p>
                         <p><strong>Contact:</strong> {match.contact}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mt-4">No matches found for the given criteria.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
