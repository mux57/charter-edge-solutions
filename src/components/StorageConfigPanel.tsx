import React, { useState, useEffect } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import { 
  getStorageConfig, 
  switchStorageBackend, 
  getStorageHealth,
  exportStorageData,
  importStorageData,
  clearAllStorageData,
  storagePresets,
  applyStoragePreset,
  storageDebug,
  type StorageBackend,
  type StorageConfig 
} from '@/lib/storage';

interface StorageConfigPanelProps {
  onConfigChange?: (config: StorageConfig) => void;
}

export const StorageConfigPanel: React.FC<StorageConfigPanelProps> = ({
  onConfigChange
}) => {
  const { toast } = useToast();
  const [currentConfig, setCurrentConfig] = useState<StorageConfig | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackend, setSelectedBackend] = useState<StorageBackend>('localStorage');
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    anonKey: '',
  });

  useEffect(() => {
    loadCurrentConfig();
    checkHealth();
  }, []);

  const loadCurrentConfig = async () => {
    try {
      const config = getStorageConfig();
      setCurrentConfig(config);
      setSelectedBackend(config.backend);
      
      if (config.options?.firebase) {
        setFirebaseConfig(config.options.firebase);
      }
      if (config.options?.supabase) {
        setSupabaseConfig(config.options.supabase);
      }
    } catch (error) {
      console.error('Failed to load storage config:', error);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await getStorageHealth();
      setHealthStatus(health);
    } catch (error) {
      console.error('Failed to check storage health:', error);
    }
  };

  const handleBackendSwitch = async () => {
    setIsLoading(true);
    
    try {
      let options: any = {};
      
      switch (selectedBackend) {
        case 'firebase':
          if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
            throw new Error('Firebase configuration is incomplete');
          }
          options = { firebase: firebaseConfig };
          break;
        case 'supabase':
          if (!supabaseConfig.url || !supabaseConfig.anonKey) {
            throw new Error('Supabase configuration is incomplete');
          }
          options = { supabase: supabaseConfig };
          break;
        case 'memory':
          options = { memory: { persistent: true } };
          break;
        case 'indexedDB':
          options = { indexedDB: { dbName: 'meeting_scheduler_db', version: 1 } };
          break;
      }

      await switchStorageBackend(selectedBackend, options);
      await loadCurrentConfig();
      await checkHealth();
      
      toast({
        title: 'Storage Backend Switched',
        description: `Successfully switched to ${selectedBackend}`,
      });

      onConfigChange?.(getStorageConfig());
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to switch storage backend: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetApply = async (presetName: keyof typeof storagePresets) => {
    setIsLoading(true);
    
    try {
      await applyStoragePreset(presetName);
      await loadCurrentConfig();
      await checkHealth();
      
      toast({
        title: 'Preset Applied',
        description: `Applied ${presetName} storage preset`,
      });

      onConfigChange?.(getStorageConfig());
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to apply preset: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportStorageData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `meeting-scheduler-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Data Exported',
        description: 'Backup file has been downloaded',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      await importStorageData(data);
      
      toast({
        title: 'Data Imported',
        description: 'Backup has been restored successfully',
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
    
    // Reset file input
    event.target.value = '';
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    try {
      await clearAllStorageData();
      
      toast({
        title: 'Data Cleared',
        description: 'All meeting data has been cleared',
      });
    } catch (error) {
      toast({
        title: 'Clear Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const getHealthIcon = () => {
    if (!healthStatus) return <RefreshCw className="h-4 w-4" />;
    
    switch (healthStatus.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const getHealthColor = () => {
    if (!healthStatus) return 'bg-gray-100 text-gray-800';
    
    switch (healthStatus.status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Storage Configuration
        </CardTitle>
        <CardDescription>
          Configure and manage your meeting data storage backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="backend" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          {/* Backend Configuration */}
          <TabsContent value="backend" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="backend-select">Storage Backend</Label>
                <Select value={selectedBackend} onValueChange={(value: StorageBackend) => setSelectedBackend(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage backend" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="localStorage">Local Storage</SelectItem>
                    <SelectItem value="memory">Memory (Testing)</SelectItem>
                    <SelectItem value="indexedDB">IndexedDB (Coming Soon)</SelectItem>
                    <SelectItem value="firebase">Firebase Firestore</SelectItem>
                    <SelectItem value="supabase">Supabase (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedBackend === 'firebase' && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="font-medium">Firebase Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firebase-api-key">API Key</Label>
                      <Input
                        id="firebase-api-key"
                        type="password"
                        value={firebaseConfig.apiKey}
                        onChange={(e) => setFirebaseConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="Your Firebase API key"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firebase-project-id">Project ID</Label>
                      <Input
                        id="firebase-project-id"
                        value={firebaseConfig.projectId}
                        onChange={(e) => setFirebaseConfig(prev => ({ ...prev, projectId: e.target.value }))}
                        placeholder="your-project-id"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firebase-auth-domain">Auth Domain</Label>
                      <Input
                        id="firebase-auth-domain"
                        value={firebaseConfig.authDomain}
                        onChange={(e) => setFirebaseConfig(prev => ({ ...prev, authDomain: e.target.value }))}
                        placeholder="your-project.firebaseapp.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firebase-storage-bucket">Storage Bucket</Label>
                      <Input
                        id="firebase-storage-bucket"
                        value={firebaseConfig.storageBucket}
                        onChange={(e) => setFirebaseConfig(prev => ({ ...prev, storageBucket: e.target.value }))}
                        placeholder="your-project.appspot.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedBackend === 'supabase' && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="font-medium">Supabase Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="supabase-url">Project URL</Label>
                      <Input
                        id="supabase-url"
                        value={supabaseConfig.url}
                        onChange={(e) => setSupabaseConfig(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://your-project.supabase.co"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supabase-anon-key">Anonymous Key</Label>
                      <Input
                        id="supabase-anon-key"
                        type="password"
                        value={supabaseConfig.anonKey}
                        onChange={(e) => setSupabaseConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                        placeholder="Your Supabase anonymous key"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleBackendSwitch} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Switching...' : 'Switch Backend'}
              </Button>
            </div>
          </TabsContent>

          {/* Health Status */}
          <TabsContent value="health" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Storage Health</h3>
                <Button variant="outline" size="sm" onClick={checkHealth}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {healthStatus && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getHealthIcon()}
                    <Badge className={getHealthColor()}>
                      {healthStatus.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {healthStatus.backend} • {healthStatus.latency.toFixed(0)}ms
                    </span>
                  </div>

                  {healthStatus.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {healthStatus.errors.map((error: string, index: number) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    id="import-file"
                  />
                  <Button asChild variant="outline" className="w-full flex items-center gap-2">
                    <label htmlFor="import-file" className="cursor-pointer">
                      <Upload className="h-4 w-4" />
                      Import Data
                    </label>
                  </Button>
                </div>
                
                <Button onClick={handleClearData} variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Presets */}
          <TabsContent value="presets" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Storage Presets</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(storagePresets).map(([name, preset]) => (
                  <Card key={name} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">{name}</h4>
                        <Badge variant="outline">{preset.backend}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {name === 'development' && 'Fast in-memory storage for development'}
                        {name === 'production' && 'Reliable browser storage for production'}
                        {name === 'firebase' && 'Cloud storage with real-time sync'}
                        {name === 'supabase' && 'PostgreSQL-based cloud storage'}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handlePresetApply(name as keyof typeof storagePresets)}
                        disabled={isLoading}
                        className="w-full"
                      >
                        Apply Preset
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
