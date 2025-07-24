import type { 
  IStorageAdapter, 
  QueryOptions, 
  StorageEvent, 
  StorageEventListener,
  IRealtimeStorage,
  StorageBackend 
} from '../types';

/**
 * Base storage adapter with common functionality
 */
export abstract class BaseStorageAdapter<T extends { id: string }> 
  implements IStorageAdapter<T>, IRealtimeStorage {
  
  protected listeners: Map<string, Set<StorageEventListener<T>>> = new Map();
  protected backend: StorageBackend;
  protected collectionName: string;

  constructor(backend: StorageBackend, collectionName: string) {
    this.backend = backend;
    this.collectionName = collectionName;
  }

  // Abstract methods that must be implemented by concrete adapters
  abstract create(data: T): Promise<T>;
  abstract getById(id: string): Promise<T | null>;
  abstract getAll(options?: QueryOptions): Promise<T[]>;
  abstract update(id: string, data: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract clear(): Promise<void>;

  // Default implementations for batch operations
  async createMany(data: T[]): Promise<T[]> {
    const results: T[] = [];
    for (const item of data) {
      const created = await this.create(item);
      results.push(created);
    }
    return results;
  }

  async updateMany(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    const results: T[] = [];
    for (const { id, data } of updates) {
      const updated = await this.update(id, data);
      if (updated) {
        results.push(updated);
      }
    }
    return results;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    let allDeleted = true;
    for (const id of ids) {
      const deleted = await this.delete(id);
      if (!deleted) {
        allDeleted = false;
      }
    }
    return allDeleted;
  }

  // Default implementation for query operations
  async find(query: QueryOptions): Promise<T[]> {
    let results = await this.getAll();

    // Apply where clause
    if (query.where) {
      results = results.filter(item => {
        return Object.entries(query.where!).every(([key, value]) => {
          const itemValue = (item as any)[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      });
    }

    // Apply sorting
    if (query.orderBy) {
      const { field, direction } = query.orderBy;
      results.sort((a, b) => {
        const aValue = (a as any)[field];
        const bValue = (b as any)[field];
        
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    if (query.offset) {
      results = results.slice(query.offset);
    }
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  async count(query?: QueryOptions): Promise<number> {
    if (!query) {
      const all = await this.getAll();
      return all.length;
    }
    const results = await this.find(query);
    return results.length;
  }

  async exists(id: string): Promise<boolean> {
    const item = await this.getById(id);
    return item !== null;
  }

  async backup(): Promise<T[]> {
    return await this.getAll();
  }

  async restore(data: T[]): Promise<void> {
    await this.clear();
    await this.createMany(data);
  }

  // Real-time functionality
  subscribe<U = T>(collection: string, listener: StorageEventListener<U>): () => void {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, new Set());
    }
    
    this.listeners.get(collection)!.add(listener as StorageEventListener<T>);
    
    // Return unsubscribe function
    return () => {
      this.unsubscribe(collection, listener as StorageEventListener<T>);
    };
  }

  unsubscribe(collection: string, listener: StorageEventListener<T>): void {
    const collectionListeners = this.listeners.get(collection);
    if (collectionListeners) {
      collectionListeners.delete(listener);
      if (collectionListeners.size === 0) {
        this.listeners.delete(collection);
      }
    }
  }

  emit<U = T>(event: StorageEvent<U>): void {
    const listeners = this.listeners.get(event.collection);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event as StorageEvent<T>);
        } catch (error) {
          console.error('Error in storage event listener:', error);
        }
      });
    }
  }

  // Helper methods for concrete implementations
  protected generateId(): string {
    return `${this.collectionName}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  protected validateData(data: Partial<T>): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Data must be a valid object');
    }
  }

  protected emitEvent(type: StorageEvent<T>['type'], id: string, data?: T): void {
    this.emit({
      type,
      collection: this.collectionName,
      id,
      data,
      timestamp: Date.now(),
    });
  }

  // Utility methods
  protected applyDefaults(data: Partial<T>, defaults: Partial<T>): T {
    return { ...defaults, ...data } as T;
  }

  protected sanitizeData(data: T): T {
    // Remove any undefined values
    const sanitized = { ...data };
    Object.keys(sanitized).forEach(key => {
      if ((sanitized as any)[key] === undefined) {
        delete (sanitized as any)[key];
      }
    });
    return sanitized;
  }

  // Performance monitoring
  protected async measurePerformance<R>(
    operation: string, 
    fn: () => Promise<R>
  ): Promise<R> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      // Log slow operations (> 100ms)
      if (duration > 100) {
        console.warn(`Slow ${this.backend} operation: ${operation} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`Failed ${this.backend} operation: ${operation} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  // Data validation helpers
  protected validateId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Invalid ID: must be a non-empty string');
    }
  }

  protected validatePartialData(data: Partial<T>): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data: must be a valid object');
    }
    
    // Don't allow ID changes in updates
    if ('id' in data && data.id !== undefined) {
      throw new Error('Cannot update ID field');
    }
  }

  // Debugging helpers
  protected debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.backend}:${this.collectionName}] ${message}`, ...args);
    }
  }

  protected error(message: string, error?: Error): void {
    console.error(`[${this.backend}:${this.collectionName}] ${message}`, error);
  }
}
