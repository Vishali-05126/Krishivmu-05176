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

const sampleResult: FarmerExchangeOutput = {
  matches: [
    {
      farmerName: 'Sample Farmer: Ramesh Kumar',
      location: 'Nearby Village, Pune',
      contact: '+91-9876512345',
      exchangeDetails: 'Has 10 quintals of Rice, wants Wheat. Willing to trade 1:1 ratio.'
    },
    {
      farmerName: 'Sample Farmer: Sita Devi',
      location: 'Baramati, Maharashtra',
      contact: '+91-9123498765',
      exchangeDetails: 'Has surplus Rice. Looking for Wheat for personal consumption.'
    },
    {
      farmerName: 'Sample Farmer: Gopal Yadav',
      location: 'Shirur, Maharashtra',
      contact: '+91-9988765432',
      exchangeDetails: 'Offers high-quality Basmati Rice in exchange for Lokwan Wheat.'
    }
  ]
};

export function FarmerExchange({ onBack }: FarmerExchangeProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FarmerExchangeOutput | null>(sampleResult);
  const [error, setError] = useState<string | null>(null);

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
          <CardDescription>Find other farmers to exchange or barter crops with. Below is a sample output.</CardDescription>
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

          {result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Potential Matches</h3>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
