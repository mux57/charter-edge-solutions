import type { IBlockedSlotsStorage, IStorageAdapter, QueryOptions } from '../types';
import type { BlockedTimeSlot } from '@/types/meeting';

/**
 * Blocked time slots storage service implementation
 */
export class BlockedSlotsStorageService implements IBlockedSlotsStorage {
  constructor(private adapter: IStorageAdapter<BlockedTimeSlot>) {}

  // Basic CRUD operations
  async create(data: BlockedTimeSlot): Promise<BlockedTimeSlot> {
    // Add timestamp if not present
    const slotData = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
    };

    return await this.adapter.create(slotData);
  }

  async getById(id: string): Promise<BlockedTimeSlot | null> {
    return await this.adapter.getById(id);
  }

  async getAll(options?: QueryOptions): Promise<BlockedTimeSlot[]> {
    return await this.adapter.getAll(options);
  }

  async update(id: string, data: Partial<BlockedTimeSlot>): Promise<BlockedTimeSlot | null> {
    return await this.adapter.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.adapter.delete(id);
  }

  async createMany(data: BlockedTimeSlot[]): Promise<BlockedTimeSlot[]> {
    const now = new Date().toISOString();
    const slotsData = data.map(slot => ({
      ...slot,
      createdAt: slot.createdAt || now,
    }));

    return await this.adapter.createMany(slotsData);
  }

  async updateMany(updates: Array<{ id: string; data: Partial<BlockedTimeSlot> }>): Promise<BlockedTimeSlot[]> {
    return await this.adapter.updateMany(updates);
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    return await this.adapter.deleteMany(ids);
  }

  async find(query: QueryOptions): Promise<BlockedTimeSlot[]> {
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

  async backup(): Promise<BlockedTimeSlot[]> {
    return await this.adapter.backup();
  }

  async restore(data: BlockedTimeSlot[]): Promise<void> {
    return await this.adapter.restore(data);
  }

  // Blocked slots specific methods
  async getByDate(date: string): Promise<BlockedTimeSlot[]> {
    return await this.find({
      where: { date },
      orderBy: {
        field: 'startTime',
        direction: 'asc',
      },
    });
  }

  async getByDateRange(startDate: string, endDate: string): Promise<BlockedTimeSlot[]> {
    const allSlots = await this.getAll();
    
    return allSlots.filter(slot => 
      slot.date >= startDate && slot.date <= endDate
    ).sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }

  async isSlotBlocked(date: string, time: string): Promise<boolean> {
    const slotsForDate = await this.getByDate(date);
    const timeMinutes = this.timeToMinutes(time);
    
    return slotsForDate.some(slot => {
      const startMinutes = this.timeToMinutes(slot.startTime);
      const endMinutes = this.timeToMinutes(slot.endTime);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
  }

  // Advanced blocked slot operations
  async isTimeRangeBlocked(date: string, startTime: string, endTime: string): Promise<boolean> {
    const slotsForDate = await this.getByDate(date);
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    
    return slotsForDate.some(slot => {
      const slotStartMinutes = this.timeToMinutes(slot.startTime);
      const slotEndMinutes = this.timeToMinutes(slot.endTime);
      
      // Check for any overlap
      return (startMinutes < slotEndMinutes && endMinutes > slotStartMinutes);
    });
  }

  async getBlockedTimesForDate(date: string): Promise<Array<{ startTime: string; endTime: string; reason?: string }>> {
    const slots = await this.getByDate(date);
    return slots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      reason: slot.reason,
    }));
  }

  async blockTimeRange(
    date: string, 
    startTime: string, 
    endTime: string, 
    reason?: string
  ): Promise<BlockedTimeSlot> {
    // Validate time range
    if (!this.isValidTimeRange(startTime, endTime)) {
      throw new Error('Invalid time range: end time must be after start time');
    }

    // Check for overlapping blocks
    const hasOverlap = await this.isTimeRangeBlocked(date, startTime, endTime);
    if (hasOverlap) {
      throw new Error('Time range overlaps with existing blocked slot');
    }

    const blockedSlot: BlockedTimeSlot = {
      id: this.generateId(),
      date,
      startTime,
      endTime,
      reason,
      createdAt: new Date().toISOString(),
    };

    return await this.create(blockedSlot);
  }

  async unblockTimeRange(date: string, startTime: string, endTime: string): Promise<boolean> {
    const slotsForDate = await this.getByDate(date);
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    
    const overlappingSlots = slotsForDate.filter(slot => {
      const slotStartMinutes = this.timeToMinutes(slot.startTime);
      const slotEndMinutes = this.timeToMinutes(slot.endTime);
      
      // Check for exact match or overlap
      return (slotStartMinutes === startMinutes && slotEndMinutes === endMinutes) ||
             (startMinutes < slotEndMinutes && endMinutes > slotStartMinutes);
    });

    if (overlappingSlots.length === 0) {
      return false;
    }

    const idsToDelete = overlappingSlots.map(slot => slot.id);
    return await this.deleteMany(idsToDelete);
  }

  async blockFullDay(date: string, reason?: string): Promise<BlockedTimeSlot> {
    return await this.blockTimeRange(date, '00:00', '23:59', reason || 'Full day blocked');
  }

  async unblockFullDay(date: string): Promise<boolean> {
    const slotsForDate = await this.getByDate(date);
    if (slotsForDate.length === 0) {
      return false;
    }

    const idsToDelete = slotsForDate.map(slot => slot.id);
    return await this.deleteMany(idsToDelete);
  }

  // Bulk operations
  async blockMultipleDays(
    dates: string[], 
    startTime: string, 
    endTime: string, 
    reason?: string
  ): Promise<BlockedTimeSlot[]> {
    const blockedSlots: BlockedTimeSlot[] = [];
    
    for (const date of dates) {
      try {
        const slot = await this.blockTimeRange(date, startTime, endTime, reason);
        blockedSlots.push(slot);
      } catch (error) {
        console.warn(`Failed to block ${date}: ${(error as Error).message}`);
      }
    }
    
    return blockedSlots;
  }

  async blockRecurring(
    startDate: string,
    endDate: string,
    daysOfWeek: number[], // 0 = Sunday, 1 = Monday, etc.
    startTime: string,
    endTime: string,
    reason?: string
  ): Promise<BlockedTimeSlot[]> {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (daysOfWeek.includes(dayOfWeek)) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return await this.blockMultipleDays(dates, startTime, endTime, reason);
  }

  // Cleanup operations
  async cleanupExpiredBlocks(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const allSlots = await this.getAll();
    
    const expiredSlots = allSlots.filter(slot => slot.date < today);
    
    if (expiredSlots.length === 0) {
      return 0;
    }
    
    const idsToDelete = expiredSlots.map(slot => slot.id);
    await this.deleteMany(idsToDelete);
    
    return expiredSlots.length;
  }

  async getUpcomingBlocks(days: number = 30): Promise<BlockedTimeSlot[]> {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = futureDate.toISOString().split('T')[0];
    
    return await this.getByDateRange(startDate, endDate);
  }

  // Utility methods
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private isValidTimeRange(startTime: string, endTime: string): boolean {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    return endMinutes > startMinutes;
  }

  private generateId(): string {
    return `blocked_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // Statistics
  async getStatistics(): Promise<{
    total: number;
    byDate: Record<string, number>;
    totalBlockedHours: number;
    averageBlockDuration: number;
  }> {
    const allSlots = await this.getAll();
    
    const byDate: Record<string, number> = {};
    let totalMinutes = 0;
    
    allSlots.forEach(slot => {
      byDate[slot.date] = (byDate[slot.date] || 0) + 1;
      
      const startMinutes = this.timeToMinutes(slot.startTime);
      const endMinutes = this.timeToMinutes(slot.endTime);
      totalMinutes += (endMinutes - startMinutes);
    });
    
    const totalBlockedHours = totalMinutes / 60;
    const averageBlockDuration = allSlots.length > 0 ? totalMinutes / allSlots.length : 0;
    
    return {
      total: allSlots.length,
      byDate,
      totalBlockedHours,
      averageBlockDuration,
    };
  }
}
