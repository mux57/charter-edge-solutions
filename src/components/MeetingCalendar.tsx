import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { Calendar, Clock, Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ConfigStorage, BookingStorage, BlockedSlotsStorage } from '@/lib/storage';
import { generateTimeSlots, getAvailableSlotsForDuration, formatTimeSlot } from '@/lib/timeSlots';
import type { TimeSlot, TimeSlotAvailability, MeetingDuration, MeetingConfig } from '@/types/meeting';
import { DEFAULT_CONFIG } from '@/types/meeting';

import 'react-day-picker/dist/style.css';

interface MeetingCalendarProps {
  selectedDuration: MeetingDuration;
  onTimeSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot | null;
  className?: string;
}

export const MeetingCalendar: React.FC<MeetingCalendarProps> = ({
  selectedDuration,
  onTimeSlotSelect,
  selectedSlot,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlotAvailability[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [config, setConfig] = useState<MeetingConfig>(DEFAULT_CONFIG);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [configData, bookingsData, blockedSlotsData] = await Promise.all([
          ConfigStorage.get(),
          BookingStorage.getAll(),
          BlockedSlotsStorage.getAll()
        ]);

        setConfig(configData);
        setExistingBookings(bookingsData);
        setBlockedSlots(blockedSlotsData);
      } catch (error) {
        console.error('Failed to load calendar data:', error);
        // Use defaults on error
        setConfig(DEFAULT_CONFIG);
        setExistingBookings([]);
        setBlockedSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate available slots when duration or data changes
  useEffect(() => {
    if (isLoading) return;
    const today = new Date();
    const endDate = addDays(today, 60); // Show 60 days ahead
    
    const timeSlots = generateTimeSlots(
      today,
      endDate,
      config.availability,
      existingBookings,
      blockedSlots
    );
    
    const availableForDuration = getAvailableSlotsForDuration(
      timeSlots,
      selectedDuration,
      config.availability,
      existingBookings
    );
    
    setAvailableSlots(availableForDuration);
    
    // Extract dates that have available slots
    const dates = availableForDuration
      .filter(daySlots => daySlots.slots.length > 0)
      .map(daySlots => new Date(daySlots.date));
    
    setAvailableDates(dates);
  }, [selectedDuration, config.availability, existingBookings, blockedSlots]);

  // Get available time slots for the selected date
  const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    const daySlots = availableSlots.find(slot => slot.date === dateString);
    return daySlots?.slots || [];
  };

  // Check if a date has available slots
  const hasAvailableSlots = (date: Date): boolean => {
    return availableDates.some(availableDate => isSameDay(date, availableDate));
  };

  // Custom day content to show availability indicator
  const renderDay = (date: Date) => {
    const hasSlots = hasAvailableSlots(date);
    const slotsCount = getTimeSlotsForDate(date).length;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{format(date, 'd')}</span>
        {hasSlots && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
          </div>
        )}
      </div>
    );
  };

  // Disable dates that don't have available slots or are in the past
  const disabledDays = {
    before: startOfDay(new Date()),
    after: addDays(new Date(), 60),
  };

  const modifiers = {
    available: availableDates,
    selected: selectedDate,
  };

  const modifiersStyles = {
    available: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
    },
    selected: {
      backgroundColor: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
    },
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Loading Calendar...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Date
          </CardTitle>
          <CardDescription>
            Choose a date for your {selectedDuration}-minute meeting. Dates with available slots are highlighted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={disabledDays}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            showOutsideDays={false}
            className="mx-auto"
            components={{
              Day: ({ date }) => renderDay(date),
            }}
          />
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Available dates</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing availability for the next 60 days in IST timezone
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Available Times
          </CardTitle>
          <CardDescription>
            {selectedDate 
              ? `Available time slots for ${format(selectedDate, 'EEEE, MMM dd, yyyy')}`
              : 'Select a date to see available time slots'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {getTimeSlotsForDate(selectedDate).map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => onTimeSlotSelect(slot)}
                    disabled={!slot.available}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {format(new Date(`2000-01-01T${slot.time}:00`), 'h:mm a')} IST
                    <Badge variant="secondary" className="ml-auto">
                      {selectedDuration}min
                    </Badge>
                  </Button>
                ))}
                
                {getTimeSlotsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No available time slots for this date</p>
                    <p className="text-sm">Please select a different date</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Select a date to view available times</p>
              <p className="text-sm">Available slots will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Selected Meeting Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{formatTimeSlot(selectedSlot)}</p>
                <p className="text-sm text-muted-foreground">
                  Duration: {selectedDuration} minutes • Time zone: IST (Indian Standard Time)
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTimeSlotSelect(selectedSlot)}
              >
                Change Time
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
