import type { MeetingBooking, MeetingType } from '@/types/meeting';

/**
 * Generate a Google Meet link
 * Note: This generates a mock Google Meet link for demo purposes.
 * In a real application, you would integrate with Google Calendar API
 * to create actual Google Meet links.
 */
export const generateGoogleMeetLink = (booking: MeetingBooking): string => {
  // Generate a realistic-looking Google Meet link
  const meetingId = generateMeetingId();
  return `https://meet.google.com/${meetingId}`;
};

/**
 * Generate a meeting ID that looks like a real Google Meet ID
 */
const generateMeetingId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  
  // Google Meet IDs typically follow pattern: xxx-xxxx-xxx
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  
  return `${part1}-${part2}-${part3}`;
};

/**
 * Generate calendar event data for the meeting
 */
export const generateCalendarEvent = (booking: MeetingBooking) => {
  const startDate = new Date(`${booking.date}T${booking.time}:00+05:30`); // IST timezone
  const endDate = new Date(startDate.getTime() + booking.duration * 60000);
  
  const event = {
    title: `Meeting with ${booking.name}`,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    description: generateEventDescription(booking),
    location: booking.meetingType === 'google-meet' ? booking.googleMeetLink : 'Phone Call',
    attendees: [
      {
        email: booking.email,
        name: booking.name,
      }
    ],
  };

  return event;
};

/**
 * Generate event description
 */
const generateEventDescription = (booking: MeetingBooking): string => {
  let description = `Meeting Details:\n\n`;
  description += `Attendee: ${booking.name}\n`;
  description += `Email: ${booking.email}\n`;
  description += `Phone: ${booking.phone}\n`;
  description += `Duration: ${booking.duration} minutes\n`;
  description += `Type: ${booking.meetingType === 'google-meet' ? 'Video Call' : 'Phone Call'}\n\n`;

  if (booking.meetingType === 'google-meet' && booking.googleMeetLink) {
    description += `Join the meeting:\n${booking.googleMeetLink}\n\n`;
  }

  if (booking.meetingType === 'phone' && booking.phoneNumber) {
    description += `Call: ${booking.phoneNumber}\n\n`;
  }

  if (booking.notes) {
    description += `Notes:\n${booking.notes}\n\n`;
  }

  if (booking.recurrence !== 'none') {
    description += `Recurrence: ${booking.recurrence}\n`;
    if (booking.recurrenceEndDate) {
      description += `Until: ${booking.recurrenceEndDate}\n`;
    }
  }

  return description;
};

/**
 * Generate ICS (iCalendar) file content for the meeting
 */
export const generateICSFile = (booking: MeetingBooking): string => {
  const event = generateCalendarEvent(booking);
  const now = new Date();
  const uid = `${booking.id}@meeting-scheduler.com`;
  
  // Format dates for ICS (YYYYMMDDTHHMMSSZ)
  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const startDate = formatICSDate(new Date(event.start));
  const endDate = formatICSDate(new Date(event.end));
  const createdDate = formatICSDate(new Date(booking.createdAt));
  const modifiedDate = formatICSDate(new Date(booking.updatedAt));

  let ics = 'BEGIN:VCALENDAR\r\n';
  ics += 'VERSION:2.0\r\n';
  ics += 'PRODID:-//Meeting Scheduler//Meeting Scheduler//EN\r\n';
  ics += 'CALSCALE:GREGORIAN\r\n';
  ics += 'METHOD:REQUEST\r\n';
  ics += 'BEGIN:VEVENT\r\n';
  ics += `UID:${uid}\r\n`;
  ics += `DTSTART:${startDate}\r\n`;
  ics += `DTEND:${endDate}\r\n`;
  ics += `DTSTAMP:${createdDate}\r\n`;
  ics += `CREATED:${createdDate}\r\n`;
  ics += `LAST-MODIFIED:${modifiedDate}\r\n`;
  ics += `SUMMARY:${event.title}\r\n`;
  ics += `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\r\n`;
  ics += `LOCATION:${event.location}\r\n`;
  ics += `ORGANIZER:CN=Meeting Scheduler:MAILTO:noreply@meeting-scheduler.com\r\n`;
  ics += `ATTENDEE;CN=${booking.name};RSVP=TRUE:MAILTO:${booking.email}\r\n`;
  ics += 'STATUS:CONFIRMED\r\n';
  ics += 'TRANSP:OPAQUE\r\n';
  
  // Add recurrence rule if applicable
  if (booking.recurrence !== 'none') {
    const rrule = generateRecurrenceRule(booking);
    if (rrule) {
      ics += `RRULE:${rrule}\r\n`;
    }
  }

  ics += 'END:VEVENT\r\n';
  ics += 'END:VCALENDAR\r\n';

  return ics;
};

/**
 * Generate recurrence rule for ICS
 */
const generateRecurrenceRule = (booking: MeetingBooking): string | null => {
  if (booking.recurrence === 'none') return null;

  let rrule = '';
  
  switch (booking.recurrence) {
    case 'weekly':
      rrule = 'FREQ=WEEKLY';
      break;
    case 'monthly':
      rrule = 'FREQ=MONTHLY';
      break;
    default:
      return null;
  }

  if (booking.recurrenceEndDate) {
    const endDate = new Date(booking.recurrenceEndDate);
    const formattedEndDate = endDate.toISOString().replace(/[-:]/g, '').split('T')[0];
    rrule += `;UNTIL=${formattedEndDate}`;
  }

  return rrule;
};

/**
 * Download ICS file
 */
export const downloadICSFile = (booking: MeetingBooking): void => {
  const icsContent = generateICSFile(booking);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `meeting-${booking.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Generate Google Calendar add event URL
 */
export const generateGoogleCalendarURL = (booking: MeetingBooking): string => {
  const event = generateCalendarEvent(booking);
  const baseURL = 'https://calendar.google.com/calendar/render';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.start.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${event.end.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    details: event.description,
    location: event.location,
    add: booking.email,
  });

  return `${baseURL}?${params.toString()}`;
};

/**
 * Generate Outlook calendar add event URL
 */
export const generateOutlookCalendarURL = (booking: MeetingBooking): string => {
  const event = generateCalendarEvent(booking);
  const baseURL = 'https://outlook.live.com/calendar/0/deeplink/compose';
  
  const params = new URLSearchParams({
    subject: event.title,
    startdt: event.start,
    enddt: event.end,
    body: event.description,
    location: event.location,
    to: booking.email,
  });

  return `${baseURL}?${params.toString()}`;
};

/**
 * Validate Google Meet link format
 */
export const isValidGoogleMeetLink = (link: string): boolean => {
  const googleMeetRegex = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
  return googleMeetRegex.test(link);
};

/**
 * Extract meeting ID from Google Meet link
 */
export const extractMeetingId = (link: string): string | null => {
  const match = link.match(/https:\/\/meet\.google\.com\/([a-z]{3}-[a-z]{4}-[a-z]{3})/);
  return match ? match[1] : null;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format Indian phone numbers
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  
  // Format 10-digit numbers
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  
  // Return original if no formatting rules match
  return phone;
};

/**
 * Generate meeting join instructions
 */
export const generateJoinInstructions = (booking: MeetingBooking): string => {
  if (booking.meetingType === 'google-meet') {
    return `To join the video meeting:
1. Click on the Google Meet link: ${booking.googleMeetLink}
2. Allow camera and microphone access when prompted
3. Click "Join now" to enter the meeting

Meeting ID: ${extractMeetingId(booking.googleMeetLink || '') || 'N/A'}

Backup phone number: +1 (US) +1-xxx-xxx-xxxx PIN: xxxxxx#`;
  } else {
    return `To join the phone meeting:
1. Call: ${booking.phoneNumber}
2. Have your phone ready at the scheduled time
3. The host will call you at ${formatPhoneNumber(booking.phone)}

Please ensure you're available at the scheduled time.`;
  }
};
