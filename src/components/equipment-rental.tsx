'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { findEquipmentRentalsAction } from '@/app/actions';
import { EquipmentRentalInput, EquipmentRentalOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  tool: z.string().min(2, 'Tool or machinery name is required.'),
  location: z.string().min(2, 'Your location is required.'),
});

interface EquipmentRentalProps {
  onBack: () => void;
}

const sampleResult: EquipmentRentalOutput = {
  rentals: [
    {
      providerName: 'Sample Rentals: Kisan Tools',
      location: 'Khadki, Pune',
      contact: '+91-9876543210',
      price: '₹2000/day for Tractor'
    },
    {
      providerName: 'Sample Rentals: Agri-Machinery Solutions',
      location: 'Chakan, Pune',
      contact: '+91-9123456789',
      price: '₹1800/day for Tractor'
    },
    {
      providerName: 'Sample Rentals: Gramin Seva Kendra',
      location: 'Wagholi, Pune',
      contact: '+91-9988776655',
      price: '₹2200/day for Tractor with driver'
    }
  ]
};

export function EquipmentRental({ onBack }: EquipmentRentalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EquipmentRentalOutput | null>(sampleResult);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tool: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);

    const input: EquipmentRentalInput = values;
    const response = await findEquipmentRentalsAction(input);

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
          <CardTitle>Equipment Rental</CardTitle>
          <CardDescription>Find and rent agricultural tools and machinery nearby. Below is a sample output.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool/Machinery</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tractor" {...field} />
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
                        <Input placeholder="e.g., Nagpur, Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Rentals
              </Button>
            </form>
          </Form>

          {error && <p className="text-destructive mt-4">{error}</p>}

          {result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Rental Providers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.rentals.map((rental, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{rental.providerName}</CardTitle>
                      <CardDescription>{rental.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <p><strong>Price:</strong> {rental.price}</p>
                       <p><strong>Contact:</strong> {rental.contact}</p>
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
