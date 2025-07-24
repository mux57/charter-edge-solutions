import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Video, Copy, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import type { MeetingBooking } from '@/types/meeting';

interface MeetingConfirmationProps {
  booking: MeetingBooking;
  onClose?: () => void;
  onReschedule?: (booking: MeetingBooking) => void;
  onCancel?: (booking: MeetingBooking) => void;
}

export const MeetingConfirmation: React.FC<MeetingConfirmationProps> = ({
  booking,
  onClose,
  onReschedule,
  onCancel
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard.`,
      });
    });
  };

  const formatMeetingDate = (date: string, time: string) => {
    const meetingDate = new Date(`${date}T${time}:00`);
    return {
      date: format(meetingDate, 'EEEE, MMMM dd, yyyy'),
      time: format(meetingDate, 'h:mm a'),
    };
  };

  const { date: formattedDate, time: formattedTime } = formatMeetingDate(booking.date, booking.time);

  const getMeetingTypeIcon = () => {
    return booking.meetingType === 'google-meet' ? (
      <Video className="h-4 w-4" />
    ) : (
      <Phone className="h-4 w-4" />
    );
  };

  const getMeetingTypeLabel = () => {
    return booking.meetingType === 'google-meet' ? 'Video Call' : 'Phone Call';
  };

  const getStatusColor = () => {
    switch (booking.status) {
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Meeting Confirmed!</CardTitle>
        <CardDescription>
          Your meeting has been successfully scheduled. You'll receive a confirmation email shortly.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Meeting Status */}
        <div className="flex items-center justify-center">
          <Badge className={getStatusColor()}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        {/* Meeting Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Date & Time
              </div>
              <div>
                <p className="font-medium">{formattedDate}</p>
                <p className="text-sm text-muted-foreground">{formattedTime} IST</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Duration
              </div>
              <p className="font-medium">{booking.duration} minutes</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {getMeetingTypeIcon()}
                Meeting Type
              </div>
              <p className="font-medium">{getMeetingTypeLabel()}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Attendee
              </div>
              <p className="font-medium">{booking.name}</p>
            </div>
          </div>

          {/* Contact Information */}
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium">Contact Information</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(booking.email, 'Email')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.phone}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(booking.phone, 'Phone number')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Meeting Link/Phone Number */}
          {(booking.googleMeetLink || booking.phoneNumber) && (
            <>
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Meeting Details</h4>
                
                {booking.googleMeetLink && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Google Meet Link:</p>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <span className="text-sm font-mono flex-1 truncate">
                        {booking.googleMeetLink}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(booking.googleMeetLink!, 'Meeting link')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(booking.googleMeetLink, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {booking.phoneNumber && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Phone Number:</p>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <span className="text-sm font-mono flex-1">
                        {booking.phoneNumber}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(booking.phoneNumber!, 'Phone number')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Recurrence Information */}
          {booking.recurrence !== 'none' && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Recurrence</h4>
                <p className="text-sm text-muted-foreground">
                  This meeting will repeat {booking.recurrence} 
                  {booking.recurrenceEndDate && ` until ${format(new Date(booking.recurrenceEndDate), 'MMM dd, yyyy')}`}
                </p>
              </div>
            </>
          )}

          {/* Notes */}
          {booking.notes && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Notes</h4>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {booking.status === 'scheduled' && (
            <>
              <Button
                variant="outline"
                onClick={() => onReschedule?.(booking)}
                className="flex-1"
              >
                Reschedule
              </Button>
              <Button
                variant="destructive"
                onClick={() => onCancel?.(booking)}
                className="flex-1"
              >
                Cancel Meeting
              </Button>
            </>
          )}
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>

        {/* Booking ID */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Booking ID: {booking.id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
