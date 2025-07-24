import type { 
  IMeetingStorage, 
  IStorageAdapter, 
  QueryOptions 
} from '../types';
import type { MeetingBooking, MeetingStatus } from '@/types/meeting';
import { isAfter, isBefore } from 'date-fns';

/**
 * Meeting storage service implementation
 */
export class MeetingStorageService implements IMeetingStorage {
  constructor(private adapter: IStorageAdapter<MeetingBooking>) {}

  // Basic CRUD operations
  async create(data: MeetingBooking): Promise<MeetingBooking> {
    // Add timestamps if not present
    const now = new Date().toISOString();
    const meetingData = {
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    return await this.adapter.create(meetingData);
  }

  async getById(id: string): Promise<MeetingBooking | null> {
    return await this.adapter.getById(id);
  }

  async getAll(options?: QueryOptions): Promise<MeetingBooking[]> {
    return await this.adapter.getAll(options);
  }

  async update(id: string, data: Partial<MeetingBooking>): Promise<MeetingBooking | null> {
    // Update timestamp
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return await this.adapter.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    return await this.adapter.delete(id);
  }

  async createMany(data: MeetingBooking[]): Promise<MeetingBooking[]> {
    const now = new Date().toISOString();
    const meetingsData = data.map(meeting => ({
      ...meeting,
      createdAt: meeting.createdAt || now,
      updatedAt: now,
    }));

    return await this.adapter.createMany(meetingsData);
  }

  async updateMany(updates: Array<{ id: string; data: Partial<MeetingBooking> }>): Promise<MeetingBooking[]> {
    const now = new Date().toISOString();
    const updatesWithTimestamp = updates.map(({ id, data }) => ({
      id,
      data: {
        ...data,
        updatedAt: now,
      },
    }));

    return await this.adapter.updateMany(updatesWithTimestamp);
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    return await this.adapter.deleteMany(ids);
  }

  async find(query: QueryOptions): Promise<MeetingBooking[]> {
    return await this.adapter.find(query);
  }

  async count(query?: QueryOptions): Promise<number> {
    return await this.adapter.count(query);
  }

  async exists(id: string): Promise<boolean> {
    return await this.adapter.exists(id);
  }

  async clear(): Promise<void> {
    return await this.adapter.clear();
  }

  async backup(): Promise<MeetingBooking[]> {
    return await this.adapter.backup();
  }

  async restore(data: MeetingBooking[]): Promise<void> {
    return await this.adapter.restore(data);
  }

  // Meeting-specific methods
  async getByDateRange(startDate: string, endDate: string): Promise<MeetingBooking[]> {
    return await this.find({
      where: {
        date: { $gte: startDate, $lte: endDate },
      },
      orderBy: {
        field: 'date',
        direction: 'asc',
      },
    });
  }

  async getByStatus(status: MeetingStatus): Promise<MeetingBooking[]> {
    return await this.find({
      where: { status },
      orderBy: {
        field: 'date',
        direction: 'asc',
      },
    });
  }

  async getByEmail(email: string): Promise<MeetingBooking[]> {
    return await this.find({
      where: { email },
      orderBy: {
        field: 'createdAt',
        direction: 'desc',
      },
    });
  }

  async updateStatus(id: string, status: MeetingStatus): Promise<boolean> {
    const updated = await this.update(id, { status });
    return updated !== null;
  }

  async getUpcoming(): Promise<MeetingBooking[]> {
    const allMeetings = await this.getByStatus('scheduled');
    const now = new Date();
    
    return allMeetings.filter(meeting => {
      const meetingDateTime = new Date(`${meeting.date}T${meeting.time}:00`);
      return isAfter(meetingDateTime, now);
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`);
      const dateB = new Date(`${b.date}T${b.time}:00`);
      return dateA.getTime() - dateB.getTime();
    });
  }

  async getPast(): Promise<MeetingBooking[]> {
    const allMeetings = await this.getAll();
    const now = new Date();
    
    return allMeetings.filter(meeting => {
      const meetingDateTime = new Date(`${meeting.date}T${meeting.time}:00`);
      return isBefore(meetingDateTime, now) || meeting.status !== 'scheduled';
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`);
      const dateB = new Date(`${b.date}T${b.time}:00`);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  }

  // Advanced query methods
  async getByDateAndTime(date: string, time: string): Promise<MeetingBooking[]> {
    return await this.find({
      where: { date, time },
    });
  }

  async getByMeetingType(meetingType: 'google-meet' | 'phone'): Promise<MeetingBooking[]> {
    return await this.find({
      where: { meetingType },
      orderBy: {
        field: 'date',
        direction: 'asc',
      },
    });
  }

  async getByDuration(duration: number): Promise<MeetingBooking[]> {
    return await this.find({
      where: { duration },
      orderBy: {
        field: 'date',
        direction: 'asc',
      },
    });
  }

  async getRecurringMeetings(): Promise<MeetingBooking[]> {
    const allMeetings = await this.getAll();
    return allMeetings.filter(meeting => meeting.recurrence !== 'none');
  }

  async getByPhoneNumber(phone: string): Promise<MeetingBooking[]> {
    return await this.find({
      where: { phone },
      orderBy: {
        field: 'createdAt',
        direction: 'desc',
      },
    });
  }

  // Statistics and analytics
  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<MeetingStatus, number>;
    byMeetingType: Record<'google-meet' | 'phone', number>;
    byDuration: Record<number, number>;
    upcoming: number;
    past: number;
  }> {
    const allMeetings = await this.getAll();
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

    allMeetings.forEach(meeting => {
      byStatus[meeting.status]++;
      byMeetingType[meeting.meetingType]++;
      byDuration[meeting.duration] = (byDuration[meeting.duration] || 0) + 1;
    });

    return {
      total: allMeetings.length,
      byStatus,
      byMeetingType,
      byDuration,
      upcoming: upcoming.length,
      past: past.length,
    };
  }

  // Search functionality
  async search(searchTerm: string): Promise<MeetingBooking[]> {
    const allMeetings = await this.getAll();
    const term = searchTerm.toLowerCase();

    return allMeetings.filter(meeting => 
      meeting.name.toLowerCase().includes(term) ||
      meeting.email.toLowerCase().includes(term) ||
      meeting.phone.includes(term) ||
      (meeting.notes && meeting.notes.toLowerCase().includes(term))
    );
  }

  // Conflict detection
  async hasConflict(date: string, time: string, duration: number, excludeId?: string): Promise<boolean> {
    const meetings = await this.getByDateAndTime(date, time);
    
    return meetings.some(meeting => {
      if (excludeId && meeting.id === excludeId) {
        return false;
      }
      
      if (meeting.status !== 'scheduled') {
        return false;
      }

      // Check for time overlap
      const meetingStart = this.timeToMinutes(meeting.time);
      const meetingEnd = meetingStart + meeting.duration;
      const newStart = this.timeToMinutes(time);
      const newEnd = newStart + duration;

      return (newStart < meetingEnd && newEnd > meetingStart);
    });
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Bulk operations
  async cancelMultiple(ids: string[]): Promise<number> {
    const updates = ids.map(id => ({
      id,
      data: { status: 'cancelled' as MeetingStatus },
    }));

    const updated = await this.updateMany(updates);
    return updated.length;
  }

  async completeMultiple(ids: string[]): Promise<number> {
    const updates = ids.map(id => ({
      id,
      data: { status: 'completed' as MeetingStatus },
    }));

    const updated = await this.updateMany(updates);
    return updated.length;
  }
}
