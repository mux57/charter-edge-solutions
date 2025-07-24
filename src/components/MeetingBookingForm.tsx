import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, User, Mail, Phone, Video, Repeat } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import { bookingFormSchema, type BookingFormData } from '@/lib/validations';
import { ConfigStorage, BookingStorage } from '@/lib/storage';
import { generateTimeSlots, getAvailableSlotsForDuration } from '@/lib/timeSlots';
import { sendConfirmationEmail } from '@/lib/emailService';
import type { MeetingBooking, TimeSlotAvailability, MeetingConfig } from '@/types/meeting';
import { DEFAULT_CONFIG } from '@/types/meeting';

interface MeetingBookingFormProps {
  onSuccess?: (booking: MeetingBooking) => void;
  onCancel?: () => void;
}

export const MeetingBookingForm: React.FC<MeetingBookingFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [availableSlots, setAvailableSlots] = useState<TimeSlotAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<MeetingConfig>(DEFAULT_CONFIG);
  const [existingBookings, setExistingBookings] = useState<MeetingBooking[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [configData, bookingsData] = await Promise.all([
          ConfigStorage.get(),
          BookingStorage.getAll()
        ]);

        setConfig(configData);
        setExistingBookings(bookingsData);
        setDataLoaded(true);
      } catch (error) {
        console.error('Failed to load booking form data:', error);
        // Use defaults on error
        setConfig(DEFAULT_CONFIG);
        setExistingBookings([]);
        setDataLoaded(true);
      }
    };

    loadData();
  }, []);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      meetingType: 'google-meet',
      duration: 30,
      date: '',
      time: '',
      recurrence: 'none',
      recurrenceEndDate: '',
      notes: '',
    },
  });

  const watchedDuration = form.watch('duration');
  const watchedRecurrence = form.watch('recurrence');

  // Generate available time slots when duration changes
  useEffect(() => {
    if (watchedDuration && dataLoaded) {
      const today = new Date();
      const endDate = addDays(today, 30); // Show 30 days ahead
      
      const timeSlots = generateTimeSlots(
        today,
        endDate,
        config.availability,
        existingBookings
      );
      
      const availableForDuration = getAvailableSlotsForDuration(
        timeSlots,
        watchedDuration,
        config.availability,
        existingBookings
      );
      
      setAvailableSlots(availableForDuration);
    }
  }, [watchedDuration, config.availability, existingBookings, dataLoaded]);

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    
    try {
      // Generate unique ID for the booking
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the booking object
      const booking: MeetingBooking = {
        id: bookingId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        meetingType: data.meetingType,
        duration: data.duration,
        date: data.date,
        time: data.time,
        recurrence: data.recurrence,
        recurrenceEndDate: data.recurrenceEndDate,
        status: 'scheduled',
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reminderSent: false,
        confirmationSent: false,
      };

      // Generate Google Meet link if needed
      if (data.meetingType === 'google-meet' && config.autoGenerateGoogleMeet) {
        booking.googleMeetLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 10)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`;
      }

      // Add phone number if phone meeting
      if (data.meetingType === 'phone' && config.defaultPhoneNumber) {
        booking.phoneNumber = config.defaultPhoneNumber;
      }

      // Save the booking
      BookingStorage.save(booking);

      // Send confirmation email
      try {
        await sendConfirmationEmail(booking);
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
        // Don't fail the booking if email fails
      }

      toast({
        title: 'Meeting Scheduled!',
        description: `Your ${data.duration}-minute ${data.meetingType === 'google-meet' ? 'video' : 'phone'} meeting has been scheduled for ${format(new Date(data.date), 'MMM dd, yyyy')} at ${data.time}. A confirmation email has been sent.`,
      });

      // Reset form
      form.reset();
      setSelectedDate('');

      // Call success callback
      onSuccess?.(booking);

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule meeting. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableTimesForDate = (date: string) => {
    const daySlots = availableSlots.find(slot => slot.date === date);
    return daySlots?.slots || [];
  };

  if (!dataLoaded) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule a Meeting
        </CardTitle>
        <CardDescription>
          Fill out the form below to schedule your meeting. Available times are shown in IST (Indian Standard Time).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Meeting Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Meeting Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="meetingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Type *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="google-meet" id="google-meet" />
                            <Label htmlFor="google-meet" className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Google Meet (Video Call)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="phone" />
                            <Label htmlFor="phone" className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Phone Call
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {config.durations.map((duration) => (
                            <SelectItem key={duration} value={duration.toString()}>
                              {duration} minutes
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Date and Time Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date & Time
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Date *</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedDate(value);
                        form.setValue('time', ''); // Reset time when date changes
                      }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a date" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSlots.map((daySlots) => (
                            <SelectItem key={daySlots.date} value={daySlots.date}>
                              {format(new Date(daySlots.date), 'EEEE, MMM dd, yyyy')}
                              ({daySlots.slots.length} slots available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Time *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDate}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedDate ? "Choose a time" : "Select date first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableTimesForDate(selectedDate).map((slot) => (
                            <SelectItem key={slot.id} value={slot.time}>
                              {format(new Date(`2000-01-01T${slot.time}:00`), 'h:mm a')} IST
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Recurrence Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                Recurrence (Optional)
              </h3>

              <FormField
                control={form.control}
                name="recurrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat Meeting</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recurrence" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">One-time meeting</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose if you want this meeting to repeat automatically.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedRecurrence !== 'none' && (
                <FormField
                  control={form.control}
                  name="recurrenceEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date for Recurring Meetings *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={form.watch('date') || format(new Date(), 'yyyy-MM-dd')}
                        />
                      </FormControl>
                      <FormDescription>
                        The last date when the recurring meeting should occur.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Separator />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific topics or requirements for the meeting..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share any additional information about the meeting (max 500 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
