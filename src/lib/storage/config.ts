import type { StorageConfig, StorageBackend } from './types';
import { createStorageFactory } from './factory';

/**
 * Storage configuration and initialization
 */

// Environment-based storage configuration
const getStorageBackend = (): StorageBackend => {
  // Check environment variables or configuration (safely)
  const envBackend = (typeof process !== 'undefined' && process.env?.REACT_APP_STORAGE_BACKEND) as StorageBackend;

  if (envBackend && ['localStorage', 'indexedDB', 'firebase', 'supabase', 'memory'].includes(envBackend)) {
    return envBackend;
  }

  // Default fallback logic
  if (typeof window !== 'undefined') {
    // Browser environment - use localStorage as default (most compatible)
    if ('localStorage' in window) {
      return 'localStorage';
    } else if ('indexedDB' in window) {
      return 'indexedDB';
    }
  }

  // Server-side or unsupported environment
  return 'memory';
};

// Create storage configuration based on environment
const createStorageConfig = (): StorageConfig => {
  const backend = getStorageBackend();
  
  const baseConfig: StorageConfig = {
    backend,
  };

  switch (backend) {
    case 'localStorage':
      return baseConfig;
      
    case 'memory':
      return {
        ...baseConfig,
        options: {
          memory: {
            persistent: true, // Use sessionStorage for persistence
          },
        },
      };
      
    case 'indexedDB':
      return {
        ...baseConfig,
        options: {
          indexedDB: {
            dbName: 'meeting_scheduler_db',
            version: 1,
          },
        },
      };
      
    case 'firebase':
      return {
        ...baseConfig,
        options: {
          firebase: {
            apiKey: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_API_KEY) || '',
            authDomain: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_AUTH_DOMAIN) || '',
            projectId: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_PROJECT_ID) || '',
            storageBucket: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_STORAGE_BUCKET) || '',
            messagingSenderId: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_MESSAGING_SENDER_ID) || '',
            appId: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_APP_ID) || '',
          },
        },
      };
      
    case 'supabase':
      return {
        ...baseConfig,
        options: {
          supabase: {
            url: (typeof process !== 'undefined' && process.env?.REACT_APP_SUPABASE_URL) || '',
            anonKey: (typeof process !== 'undefined' && process.env?.REACT_APP_SUPABASE_ANON_KEY) || '',
          },
        },
      };
      
    default:
      return baseConfig;
  }
};

// Global storage factory instance
let storageFactory: ReturnType<typeof createStorageFactory> | null = null;

/**
 * Initialize storage with configuration
 */
export const initializeStorage = async (config?: StorageConfig): Promise<void> => {
  const storageConfig = config || createStorageConfig();
  
  storageFactory = createStorageFactory(storageConfig);
  await storageFactory.initialize();
  
  console.log(`Storage initialized with ${storageConfig.backend} backend`);
};

/**
 * Get the global storage factory instance
 */
export const getStorageFactory = () => {
  if (!storageFactory) {
    throw new Error('Storage not initialized. Call initializeStorage() first.');
  }
  return storageFactory;
};

/**
 * Switch storage backend at runtime
 */
export const switchStorageBackend = async (newBackend: StorageBackend, options?: any): Promise<void> => {
  if (!storageFactory) {
    throw new Error('Storage not initialized. Call initializeStorage() first.');
  }
  
  const newConfig: StorageConfig = {
    backend: newBackend,
    options,
  };
  
  await storageFactory.switchBackend(newConfig);
  console.log(`Storage backend switched to ${newBackend}`);
};

/**
 * Get current storage configuration
 */
export const getStorageConfig = (): StorageConfig => {
  return createStorageConfig();
};

/**
 * Check if storage is ready
 */
export const isStorageReady = (): boolean => {
  return storageFactory?.isReady() ?? false;
};

/**
 * Get storage health status
 */
export const getStorageHealth = async () => {
  if (!storageFactory) {
    return {
      status: 'unhealthy' as const,
      backend: 'none' as StorageBackend,
      latency: 0,
      errors: ['Storage not initialized'],
    };
  }
  
  return await storageFactory.healthCheck();
};

/**
 * Export all data from current storage
 */
export const exportStorageData = async () => {
  if (!storageFactory) {
    throw new Error('Storage not initialized');
  }
  
  return await storageFactory.exportData();
};

/**
 * Import data to current storage
 */
export const importStorageData = async (data: any) => {
  if (!storageFactory) {
    throw new Error('Storage not initialized');
  }
  
  return await storageFactory.importData(data);
};

/**
 * Clear all storage data
 */
export const clearAllStorageData = async () => {
  if (!storageFactory) {
    throw new Error('Storage not initialized');
  }
  
  return await storageFactory.clearAllData();
};

/**
 * Storage configuration presets
 */
export const storagePresets = {
  development: {
    backend: 'memory' as StorageBackend,
    options: {
      memory: { persistent: true },
    },
  },
  
  production: {
    backend: 'localStorage' as StorageBackend,
  },
  
  firebase: {
    backend: 'firebase' as StorageBackend,
    options: {
      firebase: {
        apiKey: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_API_KEY) || '',
        authDomain: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_AUTH_DOMAIN) || '',
        projectId: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_PROJECT_ID) || '',
        storageBucket: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_STORAGE_BUCKET) || '',
        messagingSenderId: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_MESSAGING_SENDER_ID) || '',
        appId: (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_APP_ID) || '',
      },
    },
  },

  supabase: {
    backend: 'supabase' as StorageBackend,
    options: {
      supabase: {
        url: (typeof process !== 'undefined' && process.env?.REACT_APP_SUPABASE_URL) || '',
        anonKey: (typeof process !== 'undefined' && process.env?.REACT_APP_SUPABASE_ANON_KEY) || '',
      },
    },
  },
} as const;

/**
 * Apply a storage preset
 */
export const applyStoragePreset = async (presetName: keyof typeof storagePresets): Promise<void> => {
  const preset = storagePresets[presetName];
  if (!preset) {
    throw new Error(`Storage preset '${presetName}' not found`);
  }
  
  await initializeStorage(preset);
};

/**
 * Storage debugging utilities
 */
export const storageDebug = {
  /**
   * Get detailed storage information
   */
  async getInfo() {
    if (!storageFactory) {
      return { error: 'Storage not initialized' };
    }
    
    const health = await storageFactory.healthCheck();
    const backendInfo = storageFactory.getBackendInfo();
    
    return {
      health,
      backend: backendInfo,
      ready: storageFactory.isReady(),
    };
  },
  
  /**
   * Test storage operations
   */
  async testOperations() {
    if (!storageFactory) {
      throw new Error('Storage not initialized');
    }
    
    const testResults = {
      create: false,
      read: false,
      update: false,
      delete: false,
      errors: [] as string[],
    };
    
    try {
      const meetingStorage = storageFactory.createMeetingStorage();
      
      // Test create
      const testMeeting = {
        id: 'test-meeting',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        meetingType: 'google-meet' as const,
        duration: 30,
        date: '2024-01-01',
        time: '10:00',
        recurrence: 'none' as const,
        status: 'scheduled' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await meetingStorage.create(testMeeting);
      testResults.create = true;
      
      // Test read
      const retrieved = await meetingStorage.getById('test-meeting');
      testResults.read = !!retrieved;
      
      // Test update
      await meetingStorage.update('test-meeting', { name: 'Updated Test User' });
      testResults.update = true;
      
      // Test delete
      await meetingStorage.delete('test-meeting');
      testResults.delete = true;
      
    } catch (error) {
      testResults.errors.push((error as Error).message);
    }
    
    return testResults;
  },
  
  /**
   * Get storage metrics
   */
  async getMetrics() {
    if (!storageFactory) {
      throw new Error('Storage not initialized');
    }
    
    const meetingStorage = storageFactory.createMeetingStorage();
    const configStorage = storageFactory.createConfigStorage();
    const blockedSlotsStorage = storageFactory.createBlockedSlotsStorage();
    const emailTemplateStorage = storageFactory.createEmailTemplateStorage();
    
    return {
      meetings: await meetingStorage.count(),
      config: await configStorage.count(),
      blockedSlots: await blockedSlotsStorage.count(),
      emailTemplates: await emailTemplateStorage.count(),
    };
  },
};

// Auto-initialize storage on module load (with error handling)
if (typeof window !== 'undefined') {
  // Use setTimeout to avoid blocking the main thread
  setTimeout(() => {
    initializeStorage().catch(error => {
      console.warn('Failed to auto-initialize storage, using fallback:', error);
      // Fallback to localStorage (most compatible)
      initializeStorage({
        backend: 'localStorage',
      }).catch(fallbackError => {
        console.error('Failed to initialize fallback storage:', fallbackError);
      });
    });
  }, 0);
}
