'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateRemindersAction } from '@/app/actions';
import { SmartRemindersInput, SmartRemindersOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const formSchema = z.object({
  crop: z.string().min(2, 'Crop name is required.'),
  plantingDate: z.date({
    required_error: "A planting date is required.",
  }),
  location: z.string().min(2, 'Your location is required.'),
});

interface SmartRemindersProps {
  onBack: () => void;
}

export function SmartReminders({ onBack }: SmartRemindersProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmartRemindersOutput | null>(null);
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

    const input: SmartRemindersInput = {
      ...values,
      plantingDate: format(values.plantingDate, "yyyy-MM-dd"),
    };
    const response = await generateRemindersAction(input);

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
          <CardTitle>Smart Reminders</CardTitle>
          <CardDescription>Generate a weekly schedule for crop care.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="crop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wheat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plantingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Planting Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                Generate Schedule
              </Button>
            </form>
          </Form>

          {error && <p className="text-destructive mt-4">{error}</p>}
          
          {showExample && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Example Schedule for Wheat</h3>
              <p className="text-muted-foreground mb-4">This is an example of what you can expect. Fill out the form above to get a personalized schedule.</p>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Week 1: Initial Watering & Germination</AccordionTrigger>
                  <AccordionContent>Ensure the soil is consistently moist to encourage germination. Water every 2-3 days depending on weather.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Week 2-3: Thinning and Weeding</AccordionTrigger>
                  <AccordionContent>Once seedlings are a few inches tall, thin them to the recommended spacing. Remove any competing weeds.</AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                  <AccordionTrigger>Week 4: First Fertilization</AccordionTrigger>
                  <AccordionContent>Apply a balanced nitrogen-rich fertilizer to promote leafy growth. Follow package instructions for application rates.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {!showExample && result && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Your Crop Care Schedule</h3>
              {result.reminders.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {result.reminders.map((reminder) => (
                      <AccordionItem value={`item-${reminder.week}`} key={reminder.week}>
                          <AccordionTrigger>Week {reminder.week}: {reminder.task}</AccordionTrigger>
                          <AccordionContent>
                          {reminder.details}
                          </AccordionContent>
                      </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground mt-4">Could not generate a schedule for the given criteria.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
