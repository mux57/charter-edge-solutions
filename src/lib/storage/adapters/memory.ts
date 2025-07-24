import { BaseStorageAdapter } from './base';
import type { QueryOptions } from '../types';

/**
 * In-memory storage adapter for testing and development
 */
export class MemoryStorageAdapter<T extends { id: string }> extends BaseStorageAdapter<T> {
  private data: Map<string, T> = new Map();
  private persistent: boolean;

  constructor(collectionName: string, persistent = false) {
    super('memory', collectionName);
    this.persistent = persistent;
    
    // Load from sessionStorage if persistent
    if (this.persistent) {
      this.loadFromSession();
    }
  }

  private loadFromSession(): void {
    try {
      const key = `memory_storage_${this.collectionName}`;
      const data = sessionStorage.getItem(key);
      if (data) {
        const items: T[] = JSON.parse(data);
        items.forEach(item => this.data.set(item.id, item));
      }
    } catch (error) {
      this.error('Failed to load from sessionStorage', error as Error);
    }
  }

  private saveToSession(): void {
    if (!this.persistent) return;
    
    try {
      const key = `memory_storage_${this.collectionName}`;
      const items = Array.from(this.data.values());
      sessionStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      this.error('Failed to save to sessionStorage', error as Error);
    }
  }

  async create(data: T): Promise<T> {
    return this.measurePerformance('create', async () => {
      this.validateData(data);
      
      // Generate ID if not provided
      if (!data.id) {
        (data as any).id = this.generateId();
      }
      
      // Check for duplicate ID
      if (this.data.has(data.id)) {
        throw new Error(`Item with ID '${data.id}' already exists`);
      }

      const newItem = this.sanitizeData(data);
      this.data.set(newItem.id, newItem);
      this.saveToSession();
      
      this.emitEvent('created', newItem.id, newItem);
      this.debug('Created item', newItem.id);
      
      return newItem;
    });
  }

  async getById(id: string): Promise<T | null> {
    return this.measurePerformance('getById', async () => {
      this.validateId(id);
      
      const item = this.data.get(id) || null;
      this.debug('Retrieved item by ID', id, !!item);
      return item;
    });
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    return this.measurePerformance('getAll', async () => {
      const items = Array.from(this.data.values());
      
      if (!options) {
        this.debug('Retrieved all items', items.length);
        return items;
      }
      
      // Apply filtering and sorting using base class method
      const filtered = await this.find(options);
      this.debug('Retrieved filtered items', filtered.length);
      return filtered;
    });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.measurePerformance('update', async () => {
      this.validateId(id);
      this.validatePartialData(data);
      
      const existingItem = this.data.get(id);
      if (!existingItem) {
        this.debug('Item not found for update', id);
        return null;
      }
      
      const updatedItem = this.sanitizeData({ ...existingItem, ...data } as T);
      this.data.set(id, updatedItem);
      this.saveToSession();
      
      this.emitEvent('updated', id, updatedItem);
      this.debug('Updated item', id);
      
      return updatedItem;
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.measurePerformance('delete', async () => {
      this.validateId(id);
      
      const deleted = this.data.delete(id);
      if (deleted) {
        this.saveToSession();
        this.emitEvent('deleted', id);
        this.debug('Deleted item', id);
      } else {
        this.debug('Item not found for deletion', id);
      }
      
      return deleted;
    });
  }

  async clear(): Promise<void> {
    return this.measurePerformance('clear', async () => {
      this.data.clear();
      this.saveToSession();
      this.debug('Cleared all items');
    });
  }

  // Optimized batch operations for memory storage
  async createMany(data: T[]): Promise<T[]> {
    return this.measurePerformance('createMany', async () => {
      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }
      
      const newItems: T[] = [];
      
      for (const item of data) {
        this.validateData(item);
        
        // Generate ID if not provided
        if (!item.id) {
          (item as any).id = this.generateId();
        }
        
        // Check for duplicate ID
        if (this.data.has(item.id)) {
          throw new Error(`Item with ID '${item.id}' already exists`);
        }
        
        const newItem = this.sanitizeData(item);
        this.data.set(newItem.id, newItem);
        newItems.push(newItem);
      }
      
      this.saveToSession();
      
      // Emit events for all created items
      newItems.forEach(item => {
        this.emitEvent('created', item.id, item);
      });
      
      this.debug('Created multiple items', newItems.length);
      return newItems;
    });
  }

  async updateMany(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    return this.measurePerformance('updateMany', async () => {
      if (!Array.isArray(updates) || updates.length === 0) {
        return [];
      }
      
      const updatedItems: T[] = [];
      
      for (const { id, data } of updates) {
        this.validateId(id);
        this.validatePartialData(data);
        
        const existingItem = this.data.get(id);
        if (existingItem) {
          const updatedItem = this.sanitizeData({ ...existingItem, ...data } as T);
          this.data.set(id, updatedItem);
          updatedItems.push(updatedItem);
        }
      }
      
      if (updatedItems.length > 0) {
        this.saveToSession();
        
        // Emit events for all updated items
        updatedItems.forEach(item => {
          this.emitEvent('updated', item.id, item);
        });
      }
      
      this.debug('Updated multiple items', updatedItems.length);
      return updatedItems;
    });
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    return this.measurePerformance('deleteMany', async () => {
      if (!Array.isArray(ids) || ids.length === 0) {
        return true;
      }
      
      ids.forEach(id => this.validateId(id));
      
      let deletedCount = 0;
      for (const id of ids) {
        if (this.data.delete(id)) {
          deletedCount++;
        }
      }
      
      if (deletedCount > 0) {
        this.saveToSession();
        
        // Emit events for all deleted items
        ids.forEach(id => {
          this.emitEvent('deleted', id);
        });
      }
      
      this.debug('Deleted multiple items', deletedCount);
      return deletedCount === ids.length;
    });
  }

  // Memory-specific methods
  getMemoryUsage(): {
    itemCount: number;
    estimatedSize: number;
    mapSize: number;
  } {
    const items = Array.from(this.data.values());
    const estimatedSize = JSON.stringify(items).length * 2; // Rough estimate in bytes
    
    return {
      itemCount: this.data.size,
      estimatedSize,
      mapSize: this.data.size,
    };
  }

  // Get all data as a snapshot
  getSnapshot(): T[] {
    return Array.from(this.data.values());
  }

  // Load data from a snapshot
  loadSnapshot(items: T[]): void {
    this.data.clear();
    items.forEach(item => {
      this.data.set(item.id, item);
    });
    this.saveToSession();
    this.debug('Loaded snapshot', items.length);
  }

  // Check if an item exists without retrieving it
  async exists(id: string): Promise<boolean> {
    this.validateId(id);
    return this.data.has(id);
  }

  // Get keys only (for performance when you only need IDs)
  getKeys(): string[] {
    return Array.from(this.data.keys());
  }

  // Get size without loading all data
  size(): number {
    return this.data.size;
  }

  // Iterator support for large datasets
  *entries(): IterableIterator<[string, T]> {
    yield* this.data.entries();
  }

  *values(): IterableIterator<T> {
    yield* this.data.values();
  }

  *keys(): IterableIterator<string> {
    yield* this.data.keys();
  }

  // Utility methods
  static createTemporary<U extends { id: string }>(collectionName: string): MemoryStorageAdapter<U> {
    return new MemoryStorageAdapter<U>(collectionName, false);
  }

  static createPersistent<U extends { id: string }>(collectionName: string): MemoryStorageAdapter<U> {
    return new MemoryStorageAdapter<U>(collectionName, true);
  }
}
