import React, { useState } from 'react';
import { Calendar, Settings, List, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { MeetingBookingForm } from '@/components/MeetingBookingForm';
import { MeetingCalendar } from '@/components/MeetingCalendar';
import { MeetingList } from '@/components/MeetingList';
import { MeetingConfigPanel } from '@/components/MeetingConfigPanel';
import { MeetingConfirmation } from '@/components/MeetingConfirmation';

import { BookingStorage } from '@/lib/storage';
import { generateGoogleMeetLink } from '@/lib/meetingLinks';
import type { MeetingBooking, TimeSlot, MeetingDuration } from '@/types/meeting';

const MeetingScheduler: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<MeetingBooking | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<MeetingDuration>(30);

  const handleBookingSuccess = (booking: MeetingBooking) => {
    // Generate Google Meet link if needed
    if (booking.meetingType === 'google-meet' && !booking.googleMeetLink) {
      booking.googleMeetLink = generateGoogleMeetLink(booking);
      BookingStorage.save(booking);
    }

    setSelectedBooking(booking);
    setShowBookingForm(false);
    setShowConfirmation(true);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const handleViewMeeting = (booking: MeetingBooking) => {
    setSelectedBooking(booking);
    setShowConfirmation(true);
  };

  const handleEditMeeting = (booking: MeetingBooking) => {
    // For now, just show the booking form
    // In a full implementation, you'd pre-populate the form with existing data
    setShowBookingForm(true);
  };

  const handleCancelMeeting = (booking: MeetingBooking) => {
    const success = BookingStorage.updateStatus(booking.id, 'cancelled');
    if (success) {
      setShowConfirmation(false);
      // Refresh the current view
      window.location.reload();
    }
  };

  const stats = {
    totalMeetings: BookingStorage.getAll().length,
    upcomingMeetings: BookingStorage.getByStatus('scheduled').length,
    completedMeetings: BookingStorage.getByStatus('completed').length,
    cancelledMeetings: BookingStorage.getByStatus('cancelled').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Meeting Scheduler</h1>
          <p className="text-muted-foreground">
            Schedule and manage your meetings with ease
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Meetings</p>
                  <p className="text-2xl font-bold">{stats.totalMeetings}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600">{stats.upcomingMeetings}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completedMeetings}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelledMeetings}</p>
                </div>
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Meetings
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {activeTab === 'schedule' && (
              <Button onClick={() => setShowBookingForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Meeting
              </Button>
            )}
          </div>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Schedule</CardTitle>
                <CardDescription>
                  Schedule a new meeting quickly using the calendar view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Duration:</label>
                    <div className="flex gap-2">
                      {[15, 30, 60].map((duration) => (
                        <Button
                          key={duration}
                          variant={selectedDuration === duration ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDuration(duration as MeetingDuration)}
                        >
                          {duration}min
                        </Button>
                      ))}
                    </div>
                  </div>

                  <MeetingCalendar
                    selectedDuration={selectedDuration}
                    onTimeSlotSelect={handleTimeSlotSelect}
                    selectedSlot={selectedTimeSlot}
                  />

                  {selectedTimeSlot && (
                    <div className="flex justify-center">
                      <Button onClick={() => setShowBookingForm(true)} size="lg">
                        Book This Time Slot
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings">
            <MeetingList
              onViewMeeting={handleViewMeeting}
              onEditMeeting={handleEditMeeting}
              onCancelMeeting={handleCancelMeeting}
            />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>
                  View all your meetings in a calendar format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeetingCalendar
                  selectedDuration={selectedDuration}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  selectedSlot={selectedTimeSlot}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <MeetingConfigPanel />
          </TabsContent>
        </Tabs>

        {/* Booking Form Dialog */}
        <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
              <DialogDescription>
                Fill out the form to schedule your meeting
              </DialogDescription>
            </DialogHeader>
            <MeetingBookingForm
              onSuccess={handleBookingSuccess}
              onCancel={() => setShowBookingForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedBooking && (
              <MeetingConfirmation
                booking={selectedBooking}
                onClose={() => setShowConfirmation(false)}
                onReschedule={handleEditMeeting}
                onCancel={handleCancelMeeting}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MeetingScheduler;
