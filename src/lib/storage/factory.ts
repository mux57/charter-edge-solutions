import type { 
  StorageConfig, 
  StorageBackend, 
  IStorageFactory,
  IMeetingStorage,
  IConfigStorage,
  IBlockedSlotsStorage,
  IEmailTemplateStorage
} from './types';

import { LocalStorageAdapter } from './adapters/localStorage';
import { MemoryStorageAdapter } from './adapters/memory';
import { FirebaseStorageAdapter } from './adapters/firebase';

import { MeetingStorageService } from './services/meetingStorage';
import { ConfigStorageService } from './services/configStorage';
import { BlockedSlotsStorageService } from './services/blockedSlotsStorage';
import { EmailTemplateStorageService } from './services/emailTemplateStorage';

/**
 * Storage factory implementation
 */
export class StorageFactory implements IStorageFactory {
  private config: StorageConfig;
  private initialized = false;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Validate configuration
      this.validateConfig();

      // Initialize backend-specific setup
      await this.initializeBackend();

      this.initialized = true;
      console.log(`Storage factory initialized with ${this.config.backend} backend`);
    } catch (error) {
      console.error('Failed to initialize storage factory:', error);
      throw error;
    }
  }

  private validateConfig(): void {
    if (!this.config.backend) {
      throw new Error('Storage backend is required');
    }

    // Validate backend-specific configuration
    switch (this.config.backend) {
      case 'firebase':
        if (!this.config.options?.firebase) {
          throw new Error('Firebase configuration is required for Firebase backend');
        }
        break;
      case 'supabase':
        if (!this.config.options?.supabase) {
          throw new Error('Supabase configuration is required for Supabase backend');
        }
        break;
      case 'indexedDB':
        // IndexedDB configuration is optional
        break;
      case 'localStorage':
        // localStorage doesn't need configuration
        break;
      case 'memory':
        // Memory storage doesn't need configuration
        break;
      default:
        throw new Error(`Unsupported storage backend: ${this.config.backend}`);
    }
  }

  private async initializeBackend(): Promise<void> {
    switch (this.config.backend) {
      case 'localStorage':
        if (!this.isLocalStorageAvailable()) {
          throw new Error('localStorage is not available in this environment');
        }
        break;
      case 'indexedDB':
        if (!this.isIndexedDBAvailable()) {
          throw new Error('IndexedDB is not available in this environment');
        }
        break;
      case 'firebase':
        // Firebase initialization would happen in the adapter
        break;
      case 'supabase':
        // Supabase initialization would happen in the adapter
        break;
      case 'memory':
        // Memory storage doesn't need initialization
        break;
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private isIndexedDBAvailable(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }

  isReady(): boolean {
    return this.initialized;
  }

  getBackendInfo(): {
    type: StorageBackend;
    version: string;
    capabilities: string[];
  } {
    const capabilities: string[] = [];

    switch (this.config.backend) {
      case 'localStorage':
        capabilities.push('offline', 'browser-only', 'limited-storage');
        break;
      case 'indexedDB':
        capabilities.push('offline', 'browser-only', 'large-storage', 'transactions');
        break;
      case 'firebase':
        capabilities.push('real-time', 'cloud', 'authentication', 'offline-sync');
        break;
      case 'supabase':
        capabilities.push('real-time', 'cloud', 'sql', 'authentication');
        break;
      case 'memory':
        capabilities.push('fast', 'temporary', 'testing');
        break;
    }

    return {
      type: this.config.backend,
      version: '1.0.0',
      capabilities,
    };
  }

  // Factory methods for creating storage services
  createMeetingStorage(): IMeetingStorage {
    this.ensureInitialized();
    const adapter = this.createAdapter('meetings');
    return new MeetingStorageService(adapter);
  }

  createConfigStorage(): IConfigStorage {
    this.ensureInitialized();
    const adapter = this.createAdapter('config');
    return new ConfigStorageService(adapter);
  }

  createBlockedSlotsStorage(): IBlockedSlotsStorage {
    this.ensureInitialized();
    const adapter = this.createAdapter('blocked_slots');
    return new BlockedSlotsStorageService(adapter);
  }

  createEmailTemplateStorage(): IEmailTemplateStorage {
    this.ensureInitialized();
    const adapter = this.createAdapter('email_templates');
    return new EmailTemplateStorageService(adapter);
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Storage factory not initialized. Call initialize() first.');
    }
  }

  private createAdapter<T extends { id: string }>(collectionName: string): any {
    switch (this.config.backend) {
      case 'localStorage':
        return new LocalStorageAdapter<T>(collectionName);
      
      case 'memory':
        const persistent = this.config.options?.memory?.persistent ?? false;
        return new MemoryStorageAdapter<T>(collectionName, persistent);
      
      case 'firebase':
        return new FirebaseStorageAdapter<T>(collectionName, this.config.options?.firebase);
      
      case 'indexedDB':
        // TODO: Implement IndexedDB adapter
        throw new Error('IndexedDB adapter not yet implemented');
      
      case 'supabase':
        // TODO: Implement Supabase adapter
        throw new Error('Supabase adapter not yet implemented');
      
      default:
        throw new Error(`Unsupported storage backend: ${this.config.backend}`);
    }
  }

  // Utility methods
  async switchBackend(newConfig: StorageConfig): Promise<void> {
    // Export data from current backend
    const currentData = await this.exportData();
    
    // Update configuration
    this.config = newConfig;
    this.initialized = false;
    
    // Initialize new backend
    await this.initialize();
    
    // Import data to new backend
    await this.importData(currentData);
  }

  async exportData(): Promise<any> {
    this.ensureInitialized();
    
    const meetingStorage = this.createMeetingStorage();
    const configStorage = this.createConfigStorage();
    const blockedSlotsStorage = this.createBlockedSlotsStorage();
    const emailTemplateStorage = this.createEmailTemplateStorage();

    return {
      meetings: await meetingStorage.getAll(),
      config: await configStorage.get(),
      blockedSlots: await blockedSlotsStorage.getAll(),
      emailTemplates: await emailTemplateStorage.getAll(),
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        backend: this.config.backend,
      },
    };
  }

  async importData(data: any): Promise<void> {
    this.ensureInitialized();
    
    const meetingStorage = this.createMeetingStorage();
    const configStorage = this.createConfigStorage();
    const blockedSlotsStorage = this.createBlockedSlotsStorage();
    const emailTemplateStorage = this.createEmailTemplateStorage();

    // Clear existing data
    await Promise.all([
      meetingStorage.clear(),
      configStorage.clear(),
      blockedSlotsStorage.clear(),
      emailTemplateStorage.clear(),
    ]);

    // Import new data
    if (data.meetings?.length > 0) {
      await meetingStorage.createMany(data.meetings);
    }
    
    if (data.config) {
      await configStorage.save(data.config);
    }
    
    if (data.blockedSlots?.length > 0) {
      await blockedSlotsStorage.createMany(data.blockedSlots);
    }
    
    if (data.emailTemplates?.length > 0) {
      await emailTemplateStorage.createMany(data.emailTemplates);
    }
  }

  async clearAllData(): Promise<void> {
    this.ensureInitialized();
    
    const meetingStorage = this.createMeetingStorage();
    const configStorage = this.createConfigStorage();
    const blockedSlotsStorage = this.createBlockedSlotsStorage();
    const emailTemplateStorage = this.createEmailTemplateStorage();

    await Promise.all([
      meetingStorage.clear(),
      configStorage.clear(),
      blockedSlotsStorage.clear(),
      emailTemplateStorage.clear(),
    ]);
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    backend: StorageBackend;
    latency: number;
    errors: string[];
  }> {
    const start = performance.now();
    const errors: string[] = [];
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    try {
      this.ensureInitialized();
      
      // Test basic operations
      const testStorage = this.createMeetingStorage();
      await testStorage.count();
      
    } catch (error) {
      errors.push((error as Error).message);
      status = 'unhealthy';
    }

    const latency = performance.now() - start;
    
    if (latency > 1000) {
      status = status === 'healthy' ? 'degraded' : status;
      errors.push('High latency detected');
    }

    return {
      status,
      backend: this.config.backend,
      latency,
      errors,
    };
  }
}

// Factory function for creating storage factory
export const createStorageFactory = (config: StorageConfig): StorageFactory => {
  return new StorageFactory(config);
};

// Default configurations for different backends
export const defaultConfigs: Record<StorageBackend, StorageConfig> = {
  localStorage: {
    backend: 'localStorage',
  },
  memory: {
    backend: 'memory',
    options: {
      memory: {
        persistent: false,
      },
    },
  },
  indexedDB: {
    backend: 'indexedDB',
    options: {
      indexedDB: {
        dbName: 'meeting_scheduler',
        version: 1,
      },
    },
  },
  firebase: {
    backend: 'firebase',
    options: {
      firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
      },
    },
  },
  supabase: {
    backend: 'supabase',
    options: {
      supabase: {
        url: '',
        anonKey: '',
      },
    },
  },
};
