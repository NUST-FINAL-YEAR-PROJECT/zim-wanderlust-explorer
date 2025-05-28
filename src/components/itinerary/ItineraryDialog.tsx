
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { createItinerary, addDestinationToItinerary } from '@/models/Itinerary';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LoadingDialog from '@/components/ui/loading-dialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import BookingSplash from '@/components/BookingSplash';
import { useProcessDialog } from '@/hooks/useProcessDialog';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

const itinerarySchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  notes: z.string().optional(),
});

interface ItineraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDestination?: any;
}

const ItineraryDialog = ({
  isOpen,
  onClose,
  selectedDestination
}: ItineraryDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(false);
  const [createdItinerary, setCreatedItinerary] = useState<any>(null);
  const processDialog = useProcessDialog();

  const form = useForm<z.infer<typeof itinerarySchema>>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      title: selectedDestination ? `Trip to ${selectedDestination.name}` : '',
      description: '',
      notes: ''
    },
  });

  const onSubmit = async (data: z.infer<typeof itinerarySchema>) => {
    const steps = [
      'Creating itinerary',
      'Adding destinations',
      'Setting up schedule',
      'Finalizing details'
    ];

    processDialog.startProcess(
      'Creating Your Itinerary',
      steps,
      `Creating "${data.title}" itinerary`
    );

    try {
      // Step 1: Create itinerary
      processDialog.updateProgress(0);
      await new Promise(resolve => setTimeout(resolve, 500));

      const itinerary = await createItinerary(
        user?.id || '',
        data.title,
        data.description
      );

      if (!itinerary) {
        throw new Error('Failed to create itinerary');
      }

      // Step 2: Add destination if selected
      processDialog.updateProgress(1);

      if (selectedDestination) {
        const success = await addDestinationToItinerary(
          itinerary.id,
          selectedDestination.id,
          selectedDestination.name,
          data.startDate.toISOString(),
          data.endDate.toISOString(),
          data.notes
        );

        if (!success) {
          throw new Error('Failed to add destination to itinerary');
        }
      }

      // Step 3: Setup schedule
      processDialog.updateProgress(2);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Finalize
      processDialog.updateProgress(3);

      processDialog.completeProcess();
      setCreatedItinerary(itinerary);

      setTimeout(() => {
        setShowSplash(true);
      }, 1000);

      setTimeout(() => {
        setShowSplash(false);
        onClose();
        navigate(`/itinerary/${itinerary.id}`);
        toast.success("Itinerary created successfully!");
      }, 3500);

    } catch (error) {
      processDialog.closeProcess();
      console.error("Error creating itinerary:", error);
      toast.error("Failed to create itinerary. Please try again.");
    }
  };

  return (
    <>
      <LoadingDialog
        isOpen={processDialog.isOpen}
        title={processDialog.title}
        description={processDialog.description}
        progress={processDialog.progress}
        steps={processDialog.steps}
        currentStep={processDialog.currentStep}
      />

      {showSplash && (
        <BookingSplash
          duration={2500}
          bookingType="itinerary"
          itemName={form.watch('title') || 'your itinerary'}
          onComplete={() => setShowSplash(false)}
        />
      )}

      <Dialog open={isOpen && !showSplash} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Itinerary</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Itinerary Details</CardTitle>
                  <CardDescription>Plan your perfect trip</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter itinerary title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your trip..."
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date <= form.watch('startDate')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {selectedDestination && (
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes for {selectedDestination.name}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add notes for this destination..."
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={processDialog.isOpen}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={processDialog.isOpen}
                >
                  {processDialog.isOpen ? "Creating..." : "Create Itinerary"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItineraryDialog;
