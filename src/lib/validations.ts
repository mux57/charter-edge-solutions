import { z } from 'zod';
import type { MeetingDuration, MeetingType, RecurrenceType } from '@/types/meeting';

// Phone number validation (supports various formats)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

// Email validation schema
const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Phone validation schema
const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(phoneRegex, 'Please enter a valid phone number');

// Name validation schema
const nameSchema = z.string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Meeting duration validation
const durationSchema = z.union([
  z.literal(15),
  z.literal(30),
  z.literal(60)
], {
  errorMap: () => ({ message: 'Please select a valid meeting duration' })
});

// Meeting type validation
const meetingTypeSchema = z.union([
  z.literal('google-meet'),
  z.literal('phone')
], {
  errorMap: () => ({ message: 'Please select a valid meeting type' })
});

// Recurrence type validation
const recurrenceSchema = z.union([
  z.literal('none'),
  z.literal('weekly'),
  z.literal('monthly')
], {
  errorMap: () => ({ message: 'Please select a valid recurrence option' })
});

// Date validation (ISO format)
const dateSchema = z.string()
  .min(1, 'Date is required')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format');

// Time validation (HH:mm format)
const timeSchema = z.string()
  .min(1, 'Time is required')
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format');

// Notes validation (optional)
const notesSchema = z.string()
  .max(500, 'Notes must be less than 500 characters')
  .optional();

// Main booking form validation schema
export const bookingFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  meetingType: meetingTypeSchema,
  duration: durationSchema,
  date: dateSchema,
  time: timeSchema,
  recurrence: recurrenceSchema,
  recurrenceEndDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  notes: notesSchema,
}).refine((data) => {
  // If recurrence is not 'none', recurrenceEndDate is required
  if (data.recurrence !== 'none' && !data.recurrenceEndDate) {
    return false;
  }
  return true;
}, {
  message: 'End date is required for recurring meetings',
  path: ['recurrenceEndDate']
}).refine((data) => {
  // If recurrenceEndDate is provided, it should be after the meeting date
  if (data.recurrenceEndDate && data.date) {
    return new Date(data.recurrenceEndDate) > new Date(data.date);
  }
  return true;
}, {
  message: 'End date must be after the meeting date',
  path: ['recurrenceEndDate']
});

// Admin configuration validation schemas
export const availabilityConfigSchema = z.object({
  startTime: timeSchema,
  endTime: timeSchema,
  timezone: z.string().min(1, 'Timezone is required'),
  workingDays: z.array(z.number().min(0).max(6))
    .min(1, 'At least one working day is required'),
  slotDuration: z.number()
    .min(5, 'Slot duration must be at least 5 minutes')
    .max(120, 'Slot duration must be less than 120 minutes'),
  bufferTime: z.number()
    .min(0, 'Buffer time cannot be negative')
    .max(60, 'Buffer time must be less than 60 minutes'),
}).refine((data) => {
  // End time should be after start time
  const startMinutes = timeToMinutes(data.startTime);
  const endMinutes = timeToMinutes(data.endTime);
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
});

export const meetingConfigSchema = z.object({
  availability: availabilityConfigSchema,
  durations: z.array(durationSchema)
    .min(1, 'At least one duration option is required'),
  meetingTypes: z.array(meetingTypeSchema)
    .min(1, 'At least one meeting type is required'),
  defaultPhoneNumber: z.string()
    .regex(phoneRegex, 'Invalid phone number format')
    .optional(),
  autoGenerateGoogleMeet: z.boolean(),
  reminderHours: z.number()
    .min(1, 'Reminder hours must be at least 1')
    .max(168, 'Reminder hours must be less than 168 (1 week)'),
});

export const blockedTimeSlotSchema = z.object({
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  reason: z.string()
    .max(200, 'Reason must be less than 200 characters')
    .optional(),
}).refine((data) => {
  // End time should be after start time
  const startMinutes = timeToMinutes(data.startTime);
  const endMinutes = timeToMinutes(data.endTime);
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
});

export const emailTemplateSchema = z.object({
  type: z.union([
    z.literal('confirmation'),
    z.literal('reminder'),
    z.literal('cancellation')
  ]),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  body: z.string()
    .min(1, 'Email body is required')
    .max(2000, 'Email body must be less than 2000 characters'),
  variables: z.array(z.string()),
});

// Utility function to convert time string to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Type exports for form data
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type AvailabilityConfigData = z.infer<typeof availabilityConfigSchema>;
export type MeetingConfigData = z.infer<typeof meetingConfigSchema>;
export type BlockedTimeSlotData = z.infer<typeof blockedTimeSlotSchema>;
export type EmailTemplateData = z.infer<typeof emailTemplateSchema>;

// Validation helper functions
export const validateBookingForm = (data: unknown) => {
  return bookingFormSchema.safeParse(data);
};

export const validateMeetingConfig = (data: unknown) => {
  return meetingConfigSchema.safeParse(data);
};

export const validateBlockedTimeSlot = (data: unknown) => {
  return blockedTimeSlotSchema.safeParse(data);
};

export const validateEmailTemplate = (data: unknown) => {
  return emailTemplateSchema.safeParse(data);
};
