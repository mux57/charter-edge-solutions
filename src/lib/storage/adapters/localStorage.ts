import { BaseStorageAdapter } from './base';
import type { QueryOptions, StorageError } from '../types';

/**
 * localStorage adapter implementation
 */
export class LocalStorageAdapter<T extends { id: string }> extends BaseStorageAdapter<T> {
  private storageKey: string;

  constructor(collectionName: string) {
    super('localStorage', collectionName);
    this.storageKey = `meeting_scheduler_${collectionName}`;
  }

  private getStorageData(): T[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      this.error('Failed to read from localStorage', error as Error);
      return [];
    }
  }

  private setStorageData(data: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      this.error('Failed to write to localStorage', error as Error);
      throw new Error(`localStorage write failed: ${(error as Error).message}`);
    }
  }

  async create(data: T): Promise<T> {
    return this.measurePerformance('create', async () => {
      this.validateData(data);
      
      const items = this.getStorageData();
      
      // Generate ID if not provided
      if (!data.id) {
        (data as any).id = this.generateId();
      }
      
      // Check for duplicate ID
      if (items.some(item => item.id === data.id)) {
        throw new Error(`Item with ID '${data.id}' already exists`);
      }

      const newItem = this.sanitizeData(data);
      items.push(newItem);
      this.setStorageData(items);
      
      this.emitEvent('created', newItem.id, newItem);
      this.debug('Created item', newItem.id);
      
      return newItem;
    });
  }

  async getById(id: string): Promise<T | null> {
    return this.measurePerformance('getById', async () => {
      this.validateId(id);
      
      const items = this.getStorageData();
      const item = items.find(item => item.id === id);
      
      this.debug('Retrieved item by ID', id, !!item);
      return item || null;
    });
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    return this.measurePerformance('getAll', async () => {
      const items = this.getStorageData();
      
      if (!options) {
        this.debug('Retrieved all items', items.length);
        return items;
      }
      
      const filtered = await this.find(options);
      this.debug('Retrieved filtered items', filtered.length);
      return filtered;
    });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.measurePerformance('update', async () => {
      this.validateId(id);
      this.validatePartialData(data);
      
      const items = this.getStorageData();
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) {
        this.debug('Item not found for update', id);
        return null;
      }
      
      const updatedItem = this.sanitizeData({ ...items[index], ...data } as T);
      items[index] = updatedItem;
      this.setStorageData(items);
      
      this.emitEvent('updated', id, updatedItem);
      this.debug('Updated item', id);
      
      return updatedItem;
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.measurePerformance('delete', async () => {
      this.validateId(id);
      
      const items = this.getStorageData();
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) {
        this.debug('Item not found for deletion', id);
        return false;
      }
      
      items.splice(index, 1);
      this.setStorageData(items);
      
      this.emitEvent('deleted', id);
      this.debug('Deleted item', id);
      
      return true;
    });
  }

  async clear(): Promise<void> {
    return this.measurePerformance('clear', async () => {
      localStorage.removeItem(this.storageKey);
      this.debug('Cleared all items');
    });
  }

  // Optimized batch operations for localStorage
  async createMany(data: T[]): Promise<T[]> {
    return this.measurePerformance('createMany', async () => {
      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }
      
      const items = this.getStorageData();
      const newItems: T[] = [];
      
      for (const item of data) {
        this.validateData(item);
        
        // Generate ID if not provided
        if (!item.id) {
          (item as any).id = this.generateId();
        }
        
        // Check for duplicate ID
        if (items.some(existing => existing.id === item.id) || 
            newItems.some(existing => existing.id === item.id)) {
          throw new Error(`Item with ID '${item.id}' already exists`);
        }
        
        const newItem = this.sanitizeData(item);
        newItems.push(newItem);
      }
      
      items.push(...newItems);
      this.setStorageData(items);
      
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
      
      const items = this.getStorageData();
      const updatedItems: T[] = [];
      
      for (const { id, data } of updates) {
        this.validateId(id);
        this.validatePartialData(data);
        
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          const updatedItem = this.sanitizeData({ ...items[index], ...data } as T);
          items[index] = updatedItem;
          updatedItems.push(updatedItem);
        }
      }
      
      if (updatedItems.length > 0) {
        this.setStorageData(items);
        
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
      
      const items = this.getStorageData();
      const initialLength = items.length;
      
      // Filter out items to delete
      const remainingItems = items.filter(item => !ids.includes(item.id));
      const deletedCount = initialLength - remainingItems.length;
      
      if (deletedCount > 0) {
        this.setStorageData(remainingItems);
        
        // Emit events for all deleted items
        ids.forEach(id => {
          this.emitEvent('deleted', id);
        });
      }
      
      this.debug('Deleted multiple items', deletedCount);
      return deletedCount === ids.length;
    });
  }

  // localStorage-specific methods
  getStorageSize(): number {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? new Blob([data]).size : 0;
    } catch {
      return 0;
    }
  }

  getStorageInfo(): {
    key: string;
    size: number;
    itemCount: number;
    lastModified: Date | null;
  } {
    const items = this.getStorageData();
    return {
      key: this.storageKey,
      size: this.getStorageSize(),
      itemCount: items.length,
      lastModified: items.length > 0 ? new Date() : null,
    };
  }

  // Check if localStorage is available
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Get localStorage quota information
  static async getQuotaInfo(): Promise<{
    used: number;
    available: number;
    total: number;
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          available: (estimate.quota || 0) - (estimate.usage || 0),
          total: estimate.quota || 0,
        };
      } catch {
        // Fallback for browsers that don't support storage estimation
      }
    }
    
    // Rough estimate for localStorage (usually 5-10MB)
    return {
      used: 0,
      available: 5 * 1024 * 1024, // 5MB
      total: 5 * 1024 * 1024,
    };
  }
}
