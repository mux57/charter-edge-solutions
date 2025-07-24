/**
 * Legacy storage interface - now uses the new configurable storage system
 * This file maintains backward compatibility while using the new storage backend
 */

// Re-export everything from the new storage system
export {
  BookingStorage,
  ConfigStorage,
  BlockedSlotsStorage,
  EmailTemplateStorage,
  StorageUtils,
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
} from './storage/index';

// This file now serves as a compatibility layer for the new storage system
// All storage functionality has been moved to src/lib/storage/

// Legacy BookingStorage class is now re-exported from the new storage system
// All functionality has been moved to src/lib/storage/index.ts

// Legacy ConfigStorage class is now re-exported from the new storage system

// All legacy storage classes are now re-exported from the new storage system
// The new storage system provides the same interface but with configurable backends
// See src/lib/storage/index.ts for the new implementation
