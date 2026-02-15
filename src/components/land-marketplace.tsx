'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { findLandListingsAction } from '@/app/actions';
import { LandMarketplaceInput, LandMarketplaceOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  action: z.enum(['buy', 'sell', 'rent']),
  location: z.string().min(2, 'Your location is required.'),
  landSize: z.string().min(1, 'Land size is required.'),
});

interface LandMarketplaceProps {
  onBack: () => void;
}

const sampleResult: LandMarketplaceOutput = {
  listings: [
    {
      listingType: 'For Sale',
      location: 'Green Valley, 10km from city',
      size: '5 Acres',
      price: '₹50,00,000',
      contact: 'Mr. Sharma, +91 98765 77777',
    },
    {
      listingType: 'For Rent',
      location: 'Riverbank Farms, Near Highway',
      size: '10 Acres',
      price: '₹1,00,000/year',
      contact: 'Mrs. Patel, +91 91234 88888',
    },
    {
      listingType: 'For Sale',
      location: 'Hillside Plots, Scenic View',
      size: '2 Acres',
      price: '₹25,00,000',
      contact: 'Mr. Singh, +91 99887 99999',
    },
  ],
};


export function LandMarketplace({ onBack }: LandMarketplaceProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LandMarketplaceOutput | null>(sampleResult);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: 'buy',
      location: '',
      landSize: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);

    const input: LandMarketplaceInput = values;
    const response = await findLandListingsAction(input);

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
          <CardTitle>Land Marketplace</CardTitle>
          <CardDescription>Buy, sell, or rent agricultural land in your area.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="action"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an action" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Latur, Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="landSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size (Acres)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5 acres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Listings
              </Button>
            </form>
          </Form>

          {error && <p className="text-destructive mt-4">{error}</p>}

          {result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Land Listings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.listings.map((listing, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{listing.listingType}: {listing.size}</CardTitle>
                      <CardDescription>{listing.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <p><strong>Price:</strong> {listing.price}</p>
                       <p><strong>Contact:</strong> {listing.contact}</p>
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
