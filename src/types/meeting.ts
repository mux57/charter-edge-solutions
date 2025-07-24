export type MeetingDuration = 15 | 30 | 60; // minutes

export type MeetingType = 'google-meet' | 'phone';

export type RecurrenceType = 'none' | 'weekly' | 'monthly';

export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled';

export interface TimeSlot {
  id: string;
  date: string; // ISO date string
  time: string; // HH:mm format in IST
  available: boolean;
  blocked?: boolean; // Admin blocked
}

export interface MeetingBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  meetingType: MeetingType;
  duration: MeetingDuration;
  date: string; // ISO date string
  time: string; // HH:mm format in IST
  recurrence: RecurrenceType;
  recurrenceEndDate?: string; // For recurring meetings
  status: MeetingStatus;
  googleMeetLink?: string;
  phoneNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reminderSent?: boolean;
  confirmationSent?: boolean;
}

export interface AvailabilityConfig {
  startTime: string; // HH:mm format (default: "10:00")
  endTime: string; // HH:mm format (default: "18:00")
  timezone: string; // default: "Asia/Kolkata"
  workingDays: number[]; // 0-6 (Sunday-Saturday), default: [1,2,3,4,5]
  slotDuration: number; // minutes between slots (default: 15)
  bufferTime: number; // minutes buffer between meetings (default: 0)
}

export interface BlockedTimeSlot {
  id: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  reason?: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  type: 'confirmation' | 'reminder' | 'cancellation';
  subject: string;
  body: string;
  variables: string[]; // Available template variables
}

export interface MeetingConfig {
  availability: AvailabilityConfig;
  durations: MeetingDuration[];
  meetingTypes: MeetingType[];
  emailTemplates: EmailTemplate[];
  defaultPhoneNumber?: string;
  autoGenerateGoogleMeet: boolean;
  reminderHours: number; // Hours before meeting to send reminder
}

// Form validation schemas
export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  meetingType: MeetingType;
  duration: MeetingDuration;
  date: string;
  time: string;
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
  notes?: string;
}

// API response types for future backend integration
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TimeSlotAvailability {
  date: string;
  slots: TimeSlot[];
}

// Local storage keys
export const STORAGE_KEYS = {
  BOOKINGS: 'meeting_bookings',
  CONFIG: 'meeting_config',
  BLOCKED_SLOTS: 'blocked_time_slots',
  EMAIL_TEMPLATES: 'email_templates',
} as const;

// Default configuration
export const DEFAULT_CONFIG: MeetingConfig = {
  availability: {
    startTime: "10:00",
    endTime: "18:00",
    timezone: "Asia/Kolkata",
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    slotDuration: 15,
    bufferTime: 0,
  },
  durations: [15, 30, 60],
  meetingTypes: ['google-meet', 'phone'],
  emailTemplates: [],
  autoGenerateGoogleMeet: true,
  reminderHours: 24,
};

// Utility types
export type DateString = string; // ISO date format
export type TimeString = string; // HH:mm format
export type ISOString = string; // Full ISO datetime string
