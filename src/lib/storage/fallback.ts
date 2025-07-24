/**
 * Fallback storage implementation for when the main storage system fails
 * This provides a simple localStorage-based implementation that always works
 */

import type { 
  MeetingBooking, 
  MeetingConfig, 
  BlockedTimeSlot, 
  EmailTemplate,
  MeetingStatus 
} from '@/types/meeting';
import { DEFAULT_CONFIG } from '@/types/meeting';

/**
 * Simple localStorage utility
 */
class SimpleStorage {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }
}

/**
 * Fallback booking storage
 */
export class FallbackBookingStorage {
  private static readonly KEY = 'meeting_bookings';

  static async getAll(): Promise<MeetingBooking[]> {
    return SimpleStorage.get<MeetingBooking[]>(this.KEY, []);
  }

  static async getById(id: string): Promise<MeetingBooking | null> {
    const bookings = await this.getAll();
    return bookings.find(booking => booking.id === id) || null;
  }

  static async save(booking: MeetingBooking): Promise<void> {
    const bookings = await this.getAll();
    const existingIndex = bookings.findIndex(b => b.id === booking.id);
    
    if (existingIndex >= 0) {
      bookings[existingIndex] = { ...booking, updatedAt: new Date().toISOString() };
    } else {
      bookings.push(booking);
    }
    
    SimpleStorage.set(this.KEY, bookings);
  }

  static async delete(id: string): Promise<boolean> {
    const bookings = await this.getAll();
    const filteredBookings = bookings.filter(booking => booking.id !== id);
    
    if (filteredBookings.length !== bookings.length) {
      SimpleStorage.set(this.KEY, filteredBookings);
      return true;
    }
    
    return false;
  }

  static async getByStatus(status: MeetingStatus): Promise<MeetingBooking[]> {
    const bookings = await this.getAll();
    return bookings.filter(booking => booking.status === status);
  }

  static async updateStatus(id: string, status: MeetingStatus): Promise<boolean> {
    const booking = await this.getById(id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date().toISOString();
      await this.save(booking);
      return true;
    }
    return false;
  }

  static async clear(): Promise<void> {
    SimpleStorage.remove(this.KEY);
  }

  static async getUpcoming(): Promise<MeetingBooking[]> {
    const bookings = await this.getByStatus('scheduled');
    const now = new Date();
    
    return bookings.filter(booking => {
      const meetingDateTime = new Date(`${booking.date}T${booking.time}:00`);
      return meetingDateTime > now;
    });
  }

  static async getPast(): Promise<MeetingBooking[]> {
    const bookings = await this.getAll();
    const now = new Date();
    
    return bookings.filter(booking => {
      const meetingDateTime = new Date(`${booking.date}T${booking.time}:00`);
      return meetingDateTime <= now || booking.status !== 'scheduled';
    });
  }

  static async search(searchTerm: string): Promise<MeetingBooking[]> {
    const bookings = await this.getAll();
    const term = searchTerm.toLowerCase();

    return bookings.filter(booking => 
      booking.name.toLowerCase().includes(term) ||
      booking.email.toLowerCase().includes(term) ||
      booking.phone.includes(term) ||
      (booking.notes && booking.notes.toLowerCase().includes(term))
    );
  }

  static async getStatistics() {
    const bookings = await this.getAll();
    const upcoming = await this.getUpcoming();
    const past = await this.getPast();

    const byStatus: Record<MeetingStatus, number> = {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };

    const byMeetingType: Record<'google-meet' | 'phone', number> = {
      'google-meet': 0,
      'phone': 0,
    };

    const byDuration: Record<number, number> = {};

    bookings.forEach(booking => {
      byStatus[booking.status]++;
      byMeetingType[booking.meetingType]++;
      byDuration[booking.duration] = (byDuration[booking.duration] || 0) + 1;
    });

    return {
      total: bookings.length,
      byStatus,
      byMeetingType,
      byDuration,
      upcoming: upcoming.length,
      past: past.length,
    };
  }
}

/**
 * Fallback config storage
 */
export class FallbackConfigStorage {
  private static readonly KEY = 'meeting_config';

  static async get(): Promise<MeetingConfig> {
    return SimpleStorage.get<MeetingConfig>(this.KEY, DEFAULT_CONFIG);
  }

  static async save(config: MeetingConfig): Promise<void> {
    SimpleStorage.set(this.KEY, config);
  }

  static async update(updates: Partial<MeetingConfig>): Promise<void> {
    const currentConfig = await this.get();
    const updatedConfig = { ...currentConfig, ...updates };
    await this.save(updatedConfig);
  }

  static async reset(): Promise<void> {
    await this.save(DEFAULT_CONFIG);
  }
}

/**
 * Fallback blocked slots storage
 */
export class FallbackBlockedSlotsStorage {
  private static readonly KEY = 'blocked_time_slots';

  static async getAll(): Promise<BlockedTimeSlot[]> {
    return SimpleStorage.get<BlockedTimeSlot[]>(this.KEY, []);
  }

  static async getById(id: string): Promise<BlockedTimeSlot | null> {
    const slots = await this.getAll();
    return slots.find(slot => slot.id === id) || null;
  }

  static async save(slot: BlockedTimeSlot): Promise<void> {
    const slots = await this.getAll();
    const existingIndex = slots.findIndex(s => s.id === slot.id);
    
    if (existingIndex >= 0) {
      slots[existingIndex] = slot;
    } else {
      slots.push(slot);
    }
    
    SimpleStorage.set(this.KEY, slots);
  }

  static async delete(id: string): Promise<boolean> {
    const slots = await this.getAll();
    const filteredSlots = slots.filter(slot => slot.id !== id);
    
    if (filteredSlots.length !== slots.length) {
      SimpleStorage.set(this.KEY, filteredSlots);
      return true;
    }
    
    return false;
  }

  static async getByDate(date: string): Promise<BlockedTimeSlot[]> {
    const slots = await this.getAll();
    return slots.filter(slot => slot.date === date);
  }

  static async isSlotBlocked(date: string, time: string): Promise<boolean> {
    const slots = await this.getByDate(date);
    const timeMinutes = this.timeToMinutes(time);
    
    return slots.some(slot => {
      const startMinutes = this.timeToMinutes(slot.startTime);
      const endMinutes = this.timeToMinutes(slot.endTime);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
  }

  static async clear(): Promise<void> {
    SimpleStorage.remove(this.KEY);
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

/**
 * Fallback email template storage
 */
export class FallbackEmailTemplateStorage {
  private static readonly KEY = 'email_templates';

  static async getAll(): Promise<EmailTemplate[]> {
    return SimpleStorage.get<EmailTemplate[]>(this.KEY, []);
  }

  static async getById(id: string): Promise<EmailTemplate | null> {
    const templates = await this.getAll();
    return templates.find(template => template.id === id) || null;
  }

  static async getByType(type: EmailTemplate['type']): Promise<EmailTemplate | null> {
    const templates = await this.getAll();
    return templates.find(template => template.type === type) || null;
  }

  static async save(template: EmailTemplate): Promise<void> {
    const templates = await this.getAll();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    SimpleStorage.set(this.KEY, templates);
  }

  static async delete(id: string): Promise<boolean> {
    const templates = await this.getAll();
    const filteredTemplates = templates.filter(template => template.id !== id);
    
    if (filteredTemplates.length !== templates.length) {
      SimpleStorage.set(this.KEY, filteredTemplates);
      return true;
    }
    
    return false;
  }

  static async clear(): Promise<void> {
    SimpleStorage.remove(this.KEY);
  }
}
