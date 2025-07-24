import { format, addMinutes, parseISO, isAfter, isBefore, startOfDay, addDays, getDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import type { 
  TimeSlot, 
  MeetingBooking, 
  AvailabilityConfig, 
  BlockedTimeSlot, 
  MeetingDuration,
  TimeSlotAvailability 
} from '@/types/meeting';

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Convert time string to minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Get current time in IST
 */
export const getCurrentISTTime = (): Date => {
  return toZonedTime(new Date(), IST_TIMEZONE);
};

/**
 * Convert date to IST timezone
 */
export const toIST = (date: Date): Date => {
  return toZonedTime(date, IST_TIMEZONE);
};

/**
 * Convert IST date back to UTC
 */
export const fromIST = (date: Date): Date => {
  return fromZonedTime(date, IST_TIMEZONE);
};

/**
 * Check if a date is a working day based on configuration
 */
export const isWorkingDay = (date: Date, config: AvailabilityConfig): boolean => {
  const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
  return config.workingDays.includes(dayOfWeek);
};

/**
 * Generate time slots for a specific date
 */
export const generateTimeSlotsForDate = (
  date: Date,
  config: AvailabilityConfig,
  existingBookings: MeetingBooking[] = [],
  blockedSlots: BlockedTimeSlot[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const dateString = format(date, 'yyyy-MM-dd');
  
  // Check if it's a working day
  if (!isWorkingDay(date, config)) {
    return slots;
  }

  const startMinutes = timeToMinutes(config.startTime);
  const endMinutes = timeToMinutes(config.endTime);
  
  // Generate slots
  for (let minutes = startMinutes; minutes < endMinutes; minutes += config.slotDuration) {
    const timeString = minutesToTime(minutes);
    const slotId = `${dateString}-${timeString}`;
    
    // Check if slot is blocked by admin
    const isBlocked = blockedSlots.some(blocked => 
      blocked.date === dateString &&
      timeToMinutes(blocked.startTime) <= minutes &&
      timeToMinutes(blocked.endTime) > minutes
    );
    
    // Check if slot is already booked
    const isBooked = existingBookings.some(booking => 
      booking.date === dateString &&
      booking.time === timeString &&
      booking.status === 'scheduled'
    );
    
    // Check if slot is in the past
    const slotDateTime = new Date(`${dateString}T${timeString}:00`);
    const istSlotTime = toIST(slotDateTime);
    const currentIST = getCurrentISTTime();
    const isPast = isBefore(istSlotTime, currentIST);
    
    slots.push({
      id: slotId,
      date: dateString,
      time: timeString,
      available: !isBlocked && !isBooked && !isPast,
      blocked: isBlocked
    });
  }
  
  return slots;
};

/**
 * Generate time slots for multiple dates
 */
export const generateTimeSlots = (
  startDate: Date,
  endDate: Date,
  config: AvailabilityConfig,
  existingBookings: MeetingBooking[] = [],
  blockedSlots: BlockedTimeSlot[] = []
): TimeSlotAvailability[] => {
  const result: TimeSlotAvailability[] = [];
  let currentDate = startOfDay(startDate);
  
  while (!isAfter(currentDate, endDate)) {
    const slots = generateTimeSlotsForDate(currentDate, config, existingBookings, blockedSlots);
    
    if (slots.length > 0) {
      result.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        slots
      });
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  return result;
};

/**
 * Check if a time slot can accommodate a meeting of given duration
 */
export const canAccommodateDuration = (
  slot: TimeSlot,
  duration: MeetingDuration,
  config: AvailabilityConfig,
  existingBookings: MeetingBooking[] = []
): boolean => {
  if (!slot.available) return false;
  
  const slotMinutes = timeToMinutes(slot.time);
  const endMinutes = slotMinutes + duration;
  const dayEndMinutes = timeToMinutes(config.endTime);
  
  // Check if meeting would extend beyond working hours
  if (endMinutes > dayEndMinutes) return false;
  
  // Check if any existing bookings conflict with this duration
  const endTime = minutesToTime(endMinutes);
  const hasConflict = existingBookings.some(booking => {
    if (booking.date !== slot.date || booking.status !== 'scheduled') return false;
    
    const bookingStart = timeToMinutes(booking.time);
    const bookingEnd = bookingStart + booking.duration;
    
    // Check for overlap
    return (slotMinutes < bookingEnd && endMinutes > bookingStart);
  });
  
  return !hasConflict;
};

/**
 * Get available slots for a specific duration
 */
export const getAvailableSlotsForDuration = (
  timeSlots: TimeSlotAvailability[],
  duration: MeetingDuration,
  config: AvailabilityConfig,
  existingBookings: MeetingBooking[] = []
): TimeSlotAvailability[] => {
  return timeSlots.map(daySlots => ({
    ...daySlots,
    slots: daySlots.slots.filter(slot => 
      canAccommodateDuration(slot, duration, config, existingBookings)
    )
  })).filter(daySlots => daySlots.slots.length > 0);
};

/**
 * Format time slot for display
 */
export const formatTimeSlot = (slot: TimeSlot): string => {
  const date = parseISO(slot.date);
  const formattedDate = format(date, 'MMM dd, yyyy');
  const formattedTime = format(new Date(`2000-01-01T${slot.time}:00`), 'h:mm a');
  return `${formattedDate} at ${formattedTime}`;
};

/**
 * Get next available slot
 */
export const getNextAvailableSlot = (
  config: AvailabilityConfig,
  duration: MeetingDuration,
  existingBookings: MeetingBooking[] = [],
  blockedSlots: BlockedTimeSlot[] = []
): TimeSlot | null => {
  const today = getCurrentISTTime();
  const endDate = addDays(today, 30); // Look 30 days ahead
  
  const timeSlots = generateTimeSlots(today, endDate, config, existingBookings, blockedSlots);
  const availableSlots = getAvailableSlotsForDuration(timeSlots, duration, config, existingBookings);
  
  for (const daySlots of availableSlots) {
    if (daySlots.slots.length > 0) {
      return daySlots.slots[0];
    }
  }
  
  return null;
};
