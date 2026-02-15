'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { planCropsAction } from '@/app/actions';
import { CropPlannerInput, CropPlannerOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  location: z.string().min(2, 'Location is required.'),
  soilType: z.string().min(2, 'Soil type is required.'),
  month: z.string().min(2, 'Month is required.'),
});

interface CropPlannerProps {
  onBack: () => void;
}

export function CropPlanner({ onBack }: CropPlannerProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropPlannerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      soilType: '',
      month: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    setShowExample(false);
    
    const input: CropPlannerInput = values;
    const response = await planCropsAction(input);

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
          <CardTitle>Crop Planner</CardTitle>
          <CardDescription>Get AI advice on what to plant and when for the best yield.</CardDescription>
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
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Nashik, Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Loamy, Sandy, Clay" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planting Month</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., June" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
            </form>
          </Form>

          {error && <p className="text-destructive mt-4">{error}</p>}
          
          {showExample && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Example Recommendations</h3>
              <p className="text-muted-foreground mb-4">This is an example of what you can expect. Fill out the form above to get personalized advice.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader><CardTitle>Soybean</CardTitle><CardDescription>Best planting time: Early to Mid June</CardDescription></CardHeader>
                  <CardContent><p>Well-suited for the loamy soil and warm conditions of Maharashtra in June.</p></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Cotton</CardTitle><CardDescription>Best planting time: Throughout June</CardDescription></CardHeader>
                  <CardContent><p>Thrives in the climate and is a profitable cash crop in this region.</p></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Turmeric</CardTitle><CardDescription>Best planting time: Late June</CardDescription></CardHeader>
                  <CardContent><p>Good for intercropping and has high demand. Requires well-drained soil.</p></CardContent>
                </Card>
              </div>
            </div>
          )}

          {!showExample && result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Crop Recommendations</h3>
              {result.recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.recommendations.map((rec, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{rec.crop}</CardTitle>
                        <CardDescription>Best planting time: {rec.plantingTime}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{rec.reason}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mt-4">No recommendations found for the given criteria.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
