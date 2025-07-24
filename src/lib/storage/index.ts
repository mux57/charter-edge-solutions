/**
 * Main storage interface - replaces the old localStorage implementation
 * This provides a unified interface that works with any storage backend
 */

import { getStorageFactory } from './config';
import {
  FallbackBookingStorage,
  FallbackConfigStorage,
  FallbackBlockedSlotsStorage,
  FallbackEmailTemplateStorage
} from './fallback';
import type {
  MeetingBooking,
  MeetingConfig,
  BlockedTimeSlot,
  EmailTemplate,
  MeetingStatus
} from '@/types/meeting';

/**
 * Meeting storage operations
 */
export class BookingStorage {
  private static getStorage() {
    try {
      return getStorageFactory().createMeetingStorage();
    } catch (error) {
      console.warn('Main storage failed, using fallback:', error);
      return null;
    }
  }

  static async getAll(): Promise<MeetingBooking[]> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.getAll();
      }
    } catch (error) {
      console.warn('Storage getAll failed, using fallback:', error);
    }
    return await FallbackBookingStorage.getAll();
  }

  static async getById(id: string): Promise<MeetingBooking | null> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.getById(id);
      }
    } catch (error) {
      console.warn('Storage getById failed, using fallback:', error);
    }
    return await FallbackBookingStorage.getById(id);
  }

  static async save(booking: MeetingBooking): Promise<void> {
    try {
      const storage = this.getStorage();
      if (storage) {
        const existing = await storage.getById(booking.id);
        if (existing) {
          await storage.update(booking.id, booking);
        } else {
          await storage.create(booking);
        }
        return;
      }
    } catch (error) {
      console.warn('Storage save failed, using fallback:', error);
    }
    await FallbackBookingStorage.save(booking);
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.delete(id);
      }
    } catch (error) {
      console.warn('Storage delete failed, using fallback:', error);
    }
    return await FallbackBookingStorage.delete(id);
  }

  static async getByDateRange(startDate: string, endDate: string): Promise<MeetingBooking[]> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.getByDateRange(startDate, endDate);
      }
    } catch (error) {
      console.warn('Storage getByDateRange failed, using fallback:', error);
    }
    // Fallback implementation
    const allBookings = await FallbackBookingStorage.getAll();
    return allBookings.filter(booking =>
      booking.date >= startDate && booking.date <= endDate
    );
  }

  static async getByStatus(status: MeetingStatus): Promise<MeetingBooking[]> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.getByStatus(status);
      }
    } catch (error) {
      console.warn('Storage getByStatus failed, using fallback:', error);
    }
    return await FallbackBookingStorage.getByStatus(status);
  }

  static async updateStatus(id: string, status: MeetingStatus): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.updateStatus(id, status);
      }
    } catch (error) {
      console.warn('Storage updateStatus failed, using fallback:', error);
    }
    return await FallbackBookingStorage.updateStatus(id, status);
  }

  static async clear(): Promise<void> {
    try {
      const storage = this.getStorage();
      if (storage) {
        await storage.clear();
        return;
      }
    } catch (error) {
      console.warn('Storage clear failed, using fallback:', error);
    }
    await FallbackBookingStorage.clear();
  }

  // Additional methods for enhanced functionality
  static async getUpcoming(): Promise<MeetingBooking[]> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.getUpcoming();
      }
    } catch (error) {
      console.warn('Storage getUpcoming failed, using fallback:', error);
    }
    return await FallbackBookingStorage.getUpcoming();
  }

  static async getPast(): Promise<MeetingBooking[]> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.getPast();
      }
    } catch (error) {
      console.warn('Storage getPast failed, using fallback:', error);
    }
    return await FallbackBookingStorage.getPast();
  }

  static async search(searchTerm: string): Promise<MeetingBooking[]> {
    return await FallbackBookingStorage.search(searchTerm);
  }

  static async getStatistics() {
    return await FallbackBookingStorage.getStatistics();
  }
}

/**
 * Configuration storage operations
 */
export class ConfigStorage {
  private static getStorage() {
    return getStorageFactory().createConfigStorage();
  }

  static async get(): Promise<MeetingConfig> {
    const storage = this.getStorage();
    return await storage.get();
  }

  static async save(config: MeetingConfig): Promise<void> {
    const storage = this.getStorage();
    await storage.save(config);
  }

  static async update(updates: Partial<MeetingConfig>): Promise<void> {
    const storage = this.getStorage();
    await storage.update(updates);
  }

  static async reset(): Promise<void> {
    const storage = this.getStorage();
    await storage.reset();
  }

  // Additional methods (using fallback for compatibility)
  static async validateConfig(config: Partial<MeetingConfig>) {
    // Simple validation - just return valid for now
    return { valid: true, errors: [] };
  }

  static async getPresets() {
    // Return basic presets
    return {
      default: await FallbackConfigStorage.get(),
    };
  }

  static async applyPreset(presetName: string) {
    // For now, just return the current config
    return await FallbackConfigStorage.get();
  }
}

/**
 * Blocked time slots storage operations
 */
export class BlockedSlotsStorage {
  private static getStorage() {
    return getStorageFactory().createBlockedSlotsStorage();
  }

  static async getAll(): Promise<BlockedTimeSlot[]> {
    const storage = this.getStorage();
    return await storage.getAll();
  }

  static async getById(id: string): Promise<BlockedTimeSlot | null> {
    const storage = this.getStorage();
    return await storage.getById(id);
  }

  static async save(slot: BlockedTimeSlot): Promise<void> {
    const storage = this.getStorage();
    const existing = await storage.getById(slot.id);
    
    if (existing) {
      await storage.update(slot.id, slot);
    } else {
      await storage.create(slot);
    }
  }

  static async delete(id: string): Promise<boolean> {
    const storage = this.getStorage();
    return await storage.delete(id);
  }

  static async getByDate(date: string): Promise<BlockedTimeSlot[]> {
    const storage = this.getStorage();
    return await storage.getByDate(date);
  }

  static async getByDateRange(startDate: string, endDate: string): Promise<BlockedTimeSlot[]> {
    const storage = this.getStorage();
    return await storage.getByDateRange(startDate, endDate);
  }

  static async clear(): Promise<void> {
    const storage = this.getStorage();
    await storage.clear();
  }

  // Additional methods (using fallback for compatibility)
  static async isSlotBlocked(date: string, time: string): Promise<boolean> {
    try {
      const storage = this.getStorage();
      if (storage) {
        return await storage.isSlotBlocked(date, time);
      }
    } catch (error) {
      console.warn('Storage isSlotBlocked failed, using fallback:', error);
    }
    return await FallbackBlockedSlotsStorage.isSlotBlocked(date, time);
  }
}

/**
 * Email template storage operations
 */
export class EmailTemplateStorage {
  private static getStorage() {
    return getStorageFactory().createEmailTemplateStorage();
  }

  static async getAll(): Promise<EmailTemplate[]> {
    const storage = this.getStorage();
    return await storage.getAll();
  }

  static async getById(id: string): Promise<EmailTemplate | null> {
    const storage = this.getStorage();
    return await storage.getById(id);
  }

  static async getByType(type: EmailTemplate['type']): Promise<EmailTemplate | null> {
    const storage = this.getStorage();
    return await storage.getByType(type);
  }

  static async save(template: EmailTemplate): Promise<void> {
    const storage = this.getStorage();
    const existing = await storage.getById(template.id);
    
    if (existing) {
      await storage.update(template.id, template);
    } else {
      await storage.create(template);
    }
  }

  static async delete(id: string): Promise<boolean> {
    const storage = this.getStorage();
    return await storage.delete(id);
  }

  static async clear(): Promise<void> {
    const storage = this.getStorage();
    await storage.clear();
  }

  // Additional methods (using fallback for compatibility)
  static async getDefaultTemplates() {
    // Return basic default templates
    return [];
  }
}

/**
 * Storage utilities for data management
 */
export const StorageUtils = {
  /**
   * Export all data for backup
   */
  async exportData() {
    const factory = getStorageFactory();
    return await factory.exportData();
  },

  /**
   * Import data from backup
   */
  async importData(data: any) {
    const factory = getStorageFactory();
    return await factory.importData(data);
  },

  /**
   * Clear all meeting-related data
   */
  async clearAllData() {
    const factory = getStorageFactory();
    await factory.clearAllData();
  },

  /**
   * Get storage health status
   */
  async getHealthStatus() {
    const factory = getStorageFactory();
    return await factory.healthCheck();
  },

  /**
   * Get storage backend information
   */
  getBackendInfo() {
    const factory = getStorageFactory();
    return factory.getBackendInfo();
  },

  /**
   * Switch storage backend
   */
  async switchBackend(newConfig: any) {
    const factory = getStorageFactory();
    await factory.switchBackend(newConfig);
  },
};

// Re-export storage configuration functions
export {
  initializeStorage,
  getStorageFactory,
  switchStorageBackend,
  getStorageConfig,
  isStorageReady,
  getStorageHealth,
  exportStorageData,
  importStorageData,
  clearAllStorageData,
  storagePresets,
  applyStoragePreset,
  storageDebug,
} from './config';

// Re-export types
export type {
  StorageConfig,
  StorageBackend,
  IStorageFactory,
  IMeetingStorage,
  IConfigStorage,
  IBlockedSlotsStorage,
  IEmailTemplateStorage,
  StorageEvent,
  StorageEventListener,
  StorageHealth,
  StorageMetrics,
} from './types';

// Re-export adapters for direct use if needed
export { LocalStorageAdapter } from './adapters/localStorage';
export { MemoryStorageAdapter } from './adapters/memory';
export { FirebaseStorageAdapter, createFirebaseConfig } from './adapters/firebase';

// Re-export services for direct use if needed
export { MeetingStorageService } from './services/meetingStorage';
export { ConfigStorageService } from './services/configStorage';
export { BlockedSlotsStorageService } from './services/blockedSlotsStorage';
export { EmailTemplateStorageService } from './services/emailTemplateStorage';
