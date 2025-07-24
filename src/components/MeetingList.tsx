import React, { useState, useMemo, useEffect } from 'react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { Calendar, Clock, User, Phone, Video, Search, Filter, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

import { BookingStorage } from '@/lib/storage';
import type { MeetingBooking, MeetingStatus } from '@/types/meeting';

interface MeetingListProps {
  onViewMeeting?: (booking: MeetingBooking) => void;
  onEditMeeting?: (booking: MeetingBooking) => void;
  onCancelMeeting?: (booking: MeetingBooking) => void;
}

export const MeetingList: React.FC<MeetingListProps> = ({
  onViewMeeting,
  onEditMeeting,
  onCancelMeeting
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'created'>('date');
  const [allBookings, setAllBookings] = useState<MeetingBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookings on component mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const bookings = await BookingStorage.getAll();
        setAllBookings(bookings);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setAllBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = allBookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Sort bookings
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(`${a.date}T${a.time}:00`);
        const dateB = new Date(`${b.date}T${b.time}:00`);
        return dateA.getTime() - dateB.getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [allBookings, searchTerm, statusFilter, sortBy]);

  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    return filteredAndSortedBookings.filter(booking => {
      const meetingDate = new Date(`${booking.date}T${booking.time}:00`);
      return isAfter(meetingDate, now) && booking.status === 'scheduled';
    });
  }, [filteredAndSortedBookings]);

  const pastMeetings = useMemo(() => {
    const now = new Date();
    return filteredAndSortedBookings.filter(booking => {
      const meetingDate = new Date(`${booking.date}T${booking.time}:00`);
      return isBefore(meetingDate, now) || booking.status !== 'scheduled';
    });
  }, [filteredAndSortedBookings]);

  const handleStatusChange = (booking: MeetingBooking, newStatus: MeetingStatus) => {
    const success = BookingStorage.updateStatus(booking.id, newStatus);
    if (success) {
      toast({
        title: 'Status Updated',
        description: `Meeting status changed to ${newStatus}.`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update meeting status.',
        variant: 'destructive',
      });
    }
  };

  const formatMeetingTime = (date: string, time: string) => {
    const meetingDate = new Date(`${date}T${time}:00`);
    return {
      date: format(meetingDate, 'MMM dd, yyyy'),
      time: format(meetingDate, 'h:mm a'),
      dayOfWeek: format(meetingDate, 'EEEE'),
    };
  };

  const getMeetingTypeIcon = (type: string) => {
    return type === 'google-meet' ? (
      <Video className="h-4 w-4" />
    ) : (
      <Phone className="h-4 w-4" />
    );
  };

  const getStatusColor = (status: MeetingStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const MeetingCard: React.FC<{ booking: MeetingBooking }> = ({ booking }) => {
    const { date, time, dayOfWeek } = formatMeetingTime(booking.date, booking.time);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {getMeetingTypeIcon(booking.meetingType)}
                  <span>{booking.duration}min</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{booking.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{dayOfWeek}, {date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{time} IST</span>
                </div>
              </div>

              {booking.notes && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {booking.notes}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewMeeting?.(booking)}>
                  View Details
                </DropdownMenuItem>
                {booking.status === 'scheduled' && (
                  <>
                    <DropdownMenuItem onClick={() => onEditMeeting?.(booking)}>
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCancelMeeting?.(booking)}>
                      Cancel Meeting
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(booking, 'completed')}>
                      Mark as Completed
                    </DropdownMenuItem>
                  </>
                )}
                {booking.status === 'cancelled' && (
                  <DropdownMenuItem onClick={() => handleStatusChange(booking, 'scheduled')}>
                    Reactivate
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Meetings...</CardTitle>
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
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Management</CardTitle>
          <CardDescription>
            View and manage all your scheduled meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: MeetingStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'date' | 'created') => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Meeting Date</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Lists */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastMeetings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((booking) => (
              <MeetingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No upcoming meetings found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastMeetings.length > 0 ? (
            pastMeetings.map((booking) => (
              <MeetingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No past meetings found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
