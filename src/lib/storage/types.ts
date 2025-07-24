import type { 
  MeetingBooking, 
  MeetingConfig, 
  BlockedTimeSlot, 
  EmailTemplate,
  MeetingStatus 
} from '@/types/meeting';

/**
 * Storage backend types
 */
export type StorageBackend = 'localStorage' | 'indexedDB' | 'firebase' | 'supabase' | 'memory';

/**
 * Storage configuration
 */
export interface StorageConfig {
  backend: StorageBackend;
  options?: {
    // Firebase config
    firebase?: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
    };
    // Supabase config
    supabase?: {
      url: string;
      anonKey: string;
    };
    // IndexedDB config
    indexedDB?: {
      dbName: string;
      version: number;
    };
    // Memory storage config
    memory?: {
      persistent: boolean;
    };
  };
}

/**
 * Query options for filtering and sorting
 */
export interface QueryOptions {
  where?: Record<string, any>;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

/**
 * Generic storage interface that all backends must implement
 */
export interface IStorageAdapter<T = any> {
  // Basic CRUD operations
  create(data: T): Promise<T>;
  getById(id: string): Promise<T | null>;
  getAll(options?: QueryOptions): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  
  // Batch operations
  createMany(data: T[]): Promise<T[]>;
  updateMany(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]>;
  deleteMany(ids: string[]): Promise<boolean>;
  
  // Query operations
  find(query: QueryOptions): Promise<T[]>;
  count(query?: QueryOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  
  // Utility operations
  clear(): Promise<void>;
  backup(): Promise<T[]>;
  restore(data: T[]): Promise<void>;
}

/**
 * Meeting-specific storage interface
 */
export interface IMeetingStorage extends IStorageAdapter<MeetingBooking> {
  getByDateRange(startDate: string, endDate: string): Promise<MeetingBooking[]>;
  getByStatus(status: MeetingStatus): Promise<MeetingBooking[]>;
  getByEmail(email: string): Promise<MeetingBooking[]>;
  updateStatus(id: string, status: MeetingStatus): Promise<boolean>;
  getUpcoming(): Promise<MeetingBooking[]>;
  getPast(): Promise<MeetingBooking[]>;
}

/**
 * Configuration storage interface
 */
export interface IConfigStorage extends IStorageAdapter<MeetingConfig> {
  get(): Promise<MeetingConfig>;
  save(config: MeetingConfig): Promise<MeetingConfig>;
  update(updates: Partial<MeetingConfig>): Promise<MeetingConfig>;
  reset(): Promise<MeetingConfig>;
}

/**
 * Blocked slots storage interface
 */
export interface IBlockedSlotsStorage extends IStorageAdapter<BlockedTimeSlot> {
  getByDate(date: string): Promise<BlockedTimeSlot[]>;
  getByDateRange(startDate: string, endDate: string): Promise<BlockedTimeSlot[]>;
  isSlotBlocked(date: string, time: string): Promise<boolean>;
}

/**
 * Email templates storage interface
 */
export interface IEmailTemplateStorage extends IStorageAdapter<EmailTemplate> {
  getByType(type: EmailTemplate['type']): Promise<EmailTemplate | null>;
  getDefaultTemplates(): Promise<EmailTemplate[]>;
}

/**
 * Storage factory interface
 */
export interface IStorageFactory {
  createMeetingStorage(): IMeetingStorage;
  createConfigStorage(): IConfigStorage;
  createBlockedSlotsStorage(): IBlockedSlotsStorage;
  createEmailTemplateStorage(): IEmailTemplateStorage;
  
  // Utility methods
  initialize(): Promise<void>;
  isReady(): boolean;
  getBackendInfo(): {
    type: StorageBackend;
    version: string;
    capabilities: string[];
  };
}

/**
 * Storage events for real-time updates
 */
export interface StorageEvent<T = any> {
  type: 'created' | 'updated' | 'deleted';
  collection: string;
  id: string;
  data?: T;
  timestamp: number;
}

/**
 * Storage event listener
 */
export type StorageEventListener<T = any> = (event: StorageEvent<T>) => void;

/**
 * Real-time storage interface
 */
export interface IRealtimeStorage {
  subscribe<T>(collection: string, listener: StorageEventListener<T>): () => void;
  unsubscribe(collection: string, listener: StorageEventListener): void;
  emit<T>(event: StorageEvent<T>): void;
}

/**
 * Storage migration interface
 */
export interface IStorageMigration {
  version: number;
  description: string;
  up(): Promise<void>;
  down(): Promise<void>;
}

/**
 * Storage health check
 */
export interface StorageHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  backend: StorageBackend;
  latency: number;
  errors: string[];
  lastCheck: Date;
}

/**
 * Storage metrics
 */
export interface StorageMetrics {
  totalRecords: number;
  storageSize: number;
  collections: Record<string, number>;
  performance: {
    avgReadTime: number;
    avgWriteTime: number;
    avgQueryTime: number;
  };
}

/**
 * Export utility types
 */
export type StorageData = {
  meetings: MeetingBooking[];
  config: MeetingConfig;
  blockedSlots: BlockedTimeSlot[];
  emailTemplates: EmailTemplate[];
  metadata: {
    exportedAt: string;
    version: string;
    backend: StorageBackend;
  };
};

/**
 * Storage error types
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public backend: StorageBackend,
    public operation: string
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export class ConnectionError extends StorageError {
  constructor(backend: StorageBackend, details?: string) {
    super(
      `Failed to connect to ${backend}${details ? `: ${details}` : ''}`,
      'CONNECTION_ERROR',
      backend,
      'connect'
    );
  }
}

export class ValidationError extends StorageError {
  constructor(backend: StorageBackend, field: string, value: any) {
    super(
      `Validation failed for field '${field}' with value '${value}'`,
      'VALIDATION_ERROR',
      backend,
      'validate'
    );
  }
}

export class NotFoundError extends StorageError {
  constructor(backend: StorageBackend, id: string) {
    super(
      `Record with id '${id}' not found`,
      'NOT_FOUND',
      backend,
      'read'
    );
  }
}
