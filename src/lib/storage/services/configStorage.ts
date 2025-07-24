import type { IConfigStorage, IStorageAdapter, QueryOptions } from '../types';
import type { MeetingConfig } from '@/types/meeting';
import { DEFAULT_CONFIG } from '@/types/meeting';

/**
 * Configuration storage service implementation
 */
export class ConfigStorageService implements IConfigStorage {
  private readonly CONFIG_ID = 'meeting_config';

  constructor(private adapter: IStorageAdapter<MeetingConfig>) {}

  // Basic CRUD operations (implementing IStorageAdapter interface)
  async create(data: MeetingConfig): Promise<MeetingConfig> {
    const configData = {
      ...data,
      id: this.CONFIG_ID,
    } as MeetingConfig & { id: string };

    return await this.adapter.create(configData);
  }

  async getById(id: string): Promise<MeetingConfig | null> {
    return await this.adapter.getById(id);
  }

  async getAll(options?: QueryOptions): Promise<MeetingConfig[]> {
    return await this.adapter.getAll(options);
  }

  async update(id: string, data: Partial<MeetingConfig>): Promise<MeetingConfig | null> {
    return await this.adapter.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.adapter.delete(id);
  }

  async createMany(data: MeetingConfig[]): Promise<MeetingConfig[]> {
    const configsData = data.map(config => ({
      ...config,
      id: config.id || this.CONFIG_ID,
    })) as (MeetingConfig & { id: string })[];

    return await this.adapter.createMany(configsData);
  }

  async updateMany(updates: Array<{ id: string; data: Partial<MeetingConfig> }>): Promise<MeetingConfig[]> {
    return await this.adapter.updateMany(updates);
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    return await this.adapter.deleteMany(ids);
  }

  async find(query: QueryOptions): Promise<MeetingConfig[]> {
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

  async backup(): Promise<MeetingConfig[]> {
    return await this.adapter.backup();
  }

  async restore(data: MeetingConfig[]): Promise<void> {
    return await this.adapter.restore(data);
  }

  // Configuration-specific methods
  async get(): Promise<MeetingConfig> {
    const config = await this.getById(this.CONFIG_ID);
    
    if (!config) {
      // Create default configuration if it doesn't exist
      return await this.save(DEFAULT_CONFIG);
    }
    
    // Merge with defaults to ensure all properties exist
    return this.mergeWithDefaults(config);
  }

  async save(config: MeetingConfig): Promise<MeetingConfig> {
    const existingConfig = await this.getById(this.CONFIG_ID);
    
    if (existingConfig) {
      // Update existing configuration
      const updated = await this.update(this.CONFIG_ID, config);
      return updated || config;
    } else {
      // Create new configuration
      return await this.create(config);
    }
  }

  async update(updates: Partial<MeetingConfig>): Promise<MeetingConfig> {
    const existingConfig = await this.get();
    const updatedConfig = this.mergeConfigs(existingConfig, updates);
    return await this.save(updatedConfig);
  }

  async reset(): Promise<MeetingConfig> {
    await this.delete(this.CONFIG_ID);
    return await this.save(DEFAULT_CONFIG);
  }

  // Configuration validation and merging
  private mergeWithDefaults(config: Partial<MeetingConfig>): MeetingConfig {
    return this.mergeConfigs(DEFAULT_CONFIG, config);
  }

  private mergeConfigs(base: MeetingConfig, updates: Partial<MeetingConfig>): MeetingConfig {
    return {
      ...base,
      ...updates,
      availability: {
        ...base.availability,
        ...updates.availability,
      },
      durations: updates.durations || base.durations,
      meetingTypes: updates.meetingTypes || base.meetingTypes,
      emailTemplates: updates.emailTemplates || base.emailTemplates,
    };
  }

  // Configuration validation
  async validateConfig(config: Partial<MeetingConfig>): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    if (config.availability) {
      const { availability } = config;
      
      // Validate time format
      if (availability.startTime && !this.isValidTimeFormat(availability.startTime)) {
        errors.push('Invalid start time format. Use HH:mm format.');
      }
      
      if (availability.endTime && !this.isValidTimeFormat(availability.endTime)) {
        errors.push('Invalid end time format. Use HH:mm format.');
      }
      
      // Validate time range
      if (availability.startTime && availability.endTime) {
        const startMinutes = this.timeToMinutes(availability.startTime);
        const endMinutes = this.timeToMinutes(availability.endTime);
        
        if (endMinutes <= startMinutes) {
          errors.push('End time must be after start time.');
        }
      }
      
      // Validate working days
      if (availability.workingDays && availability.workingDays.length === 0) {
        errors.push('At least one working day must be selected.');
      }
      
      if (availability.workingDays) {
        const invalidDays = availability.workingDays.filter(day => day < 0 || day > 6);
        if (invalidDays.length > 0) {
          errors.push('Working days must be between 0 (Sunday) and 6 (Saturday).');
        }
      }
      
      // Validate slot duration
      if (availability.slotDuration && (availability.slotDuration < 5 || availability.slotDuration > 120)) {
        errors.push('Slot duration must be between 5 and 120 minutes.');
      }
      
      // Validate buffer time
      if (availability.bufferTime && (availability.bufferTime < 0 || availability.bufferTime > 60)) {
        errors.push('Buffer time must be between 0 and 60 minutes.');
      }
    }

    // Validate durations
    if (config.durations) {
      if (config.durations.length === 0) {
        errors.push('At least one duration option must be available.');
      }
      
      const invalidDurations = config.durations.filter(duration => ![15, 30, 60].includes(duration));
      if (invalidDurations.length > 0) {
        errors.push('Invalid duration options. Only 15, 30, and 60 minutes are supported.');
      }
    }

    // Validate meeting types
    if (config.meetingTypes) {
      if (config.meetingTypes.length === 0) {
        errors.push('At least one meeting type must be available.');
      }
      
      const invalidTypes = config.meetingTypes.filter(type => !['google-meet', 'phone'].includes(type));
      if (invalidTypes.length > 0) {
        errors.push('Invalid meeting types. Only google-meet and phone are supported.');
      }
    }

    // Validate reminder hours
    if (config.reminderHours && (config.reminderHours < 1 || config.reminderHours > 168)) {
      errors.push('Reminder hours must be between 1 and 168 (1 week).');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Configuration presets
  async getPresets(): Promise<Record<string, MeetingConfig>> {
    return {
      default: DEFAULT_CONFIG,
      business: {
        ...DEFAULT_CONFIG,
        availability: {
          ...DEFAULT_CONFIG.availability,
          startTime: "09:00",
          endTime: "17:00",
          workingDays: [1, 2, 3, 4, 5], // Monday to Friday
          slotDuration: 30,
          bufferTime: 15,
        },
        durations: [30, 60],
        reminderHours: 24,
      },
      flexible: {
        ...DEFAULT_CONFIG,
        availability: {
          ...DEFAULT_CONFIG.availability,
          startTime: "08:00",
          endTime: "20:00",
          workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
          slotDuration: 15,
          bufferTime: 0,
        },
        durations: [15, 30, 60],
        reminderHours: 2,
      },
      minimal: {
        ...DEFAULT_CONFIG,
        availability: {
          ...DEFAULT_CONFIG.availability,
          startTime: "10:00",
          endTime: "16:00",
          workingDays: [1, 2, 3, 4, 5], // Monday to Friday
          slotDuration: 60,
          bufferTime: 30,
        },
        durations: [60],
        meetingTypes: ['google-meet'],
        reminderHours: 48,
      },
    };
  }

  async applyPreset(presetName: string): Promise<MeetingConfig> {
    const presets = await this.getPresets();
    const preset = presets[presetName];
    
    if (!preset) {
      throw new Error(`Preset '${presetName}' not found`);
    }
    
    return await this.save(preset);
  }

  // Configuration history (if needed for auditing)
  async getConfigHistory(): Promise<Array<{
    timestamp: string;
    config: MeetingConfig;
    changes?: string[];
  }>> {
    // This would require additional storage for history
    // For now, return empty array
    return [];
  }

  // Export/Import configuration
  async exportConfig(): Promise<string> {
    const config = await this.get();
    return JSON.stringify(config, null, 2);
  }

  async importConfig(configJson: string): Promise<MeetingConfig> {
    try {
      const config = JSON.parse(configJson) as MeetingConfig;
      const validation = await this.validateConfig(config);
      
      if (!validation.valid) {
        throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
      }
      
      return await this.save(config);
    } catch (error) {
      throw new Error(`Failed to import configuration: ${(error as Error).message}`);
    }
  }
}
