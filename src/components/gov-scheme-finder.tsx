'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { findGovSchemesAction } from '@/app/actions';
import { GovSchemeInput, GovSchemeOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  location: z.string().min(2, 'Location is required.'),
  crop: z.string().optional(),
  category: z.string().optional(),
});

interface GovSchemeFinderProps {
  onBack: () => void;
}

const sampleResult: GovSchemeOutput = {
  schemes: [
    {
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      description: 'Provides income support to all landholding farmer families.',
      eligibility: 'All landholding farmers\' families.',
      link: 'https://pmkisan.gov.in/',
    },
    {
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'An insurance service for farmers for their yields.',
      eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.',
      link: 'https://pmfby.gov.in/',
    },
    {
      name: 'Kisan Credit Card (KCC) Scheme',
      description: 'Provides farmers with timely access to credit.',
      eligibility: 'All farmers - individuals/joint borrowers who are owner cultivators.',
      link: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card',
    },
  ],
};


export function GovSchemeFinder({ onBack }: GovSchemeFinderProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GovSchemeOutput | null>(sampleResult);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      crop: '',
      category: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);

    const input: GovSchemeInput = values;
    const response = await findGovSchemesAction(input);

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
          <CardTitle>Government Schemes Finder</CardTitle>
          <CardDescription>Find relevant government schemes, subsidies, and financial support.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sugarcane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Small Farmer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Schemes
              </Button>
            </form>
          </Form>

          {error && <p className="text-destructive mt-4">{error}</p>}

          {result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Recommended Schemes</h3>
              <div className="space-y-6">
                {result.schemes.map((scheme, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{scheme.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Description</h4>
                        <p className="text-muted-foreground">{scheme.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Eligibility</h4>
                        <p className="text-muted-foreground">{scheme.eligibility}</p>
                      </div>
                      <Button asChild variant="link" className="p-0 h-auto">
                        <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                          Learn More
                        </a>
                      </Button>
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
