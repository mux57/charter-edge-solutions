import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings, Clock, Calendar, Phone, Mail, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import { meetingConfigSchema, type MeetingConfigData } from '@/lib/validations';
import { ConfigStorage } from '@/lib/storage';
import { StorageConfigPanel } from '@/components/StorageConfigPanel';
import type { MeetingConfig, MeetingDuration, MeetingType } from '@/types/meeting';

interface MeetingConfigPanelProps {
  onConfigUpdate?: (config: MeetingConfig) => void;
}

export const MeetingConfigPanel: React.FC<MeetingConfigPanelProps> = ({
  onConfigUpdate
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<MeetingConfig | null>(null);

  const form = useForm<MeetingConfigData>({
    resolver: zodResolver(meetingConfigSchema),
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await ConfigStorage.get();
        setCurrentConfig(config);
        form.reset({
          availability: config.availability,
          durations: config.durations,
          meetingTypes: config.meetingTypes,
          defaultPhoneNumber: config.defaultPhoneNumber || '',
          autoGenerateGoogleMeet: config.autoGenerateGoogleMeet,
          reminderHours: config.reminderHours,
        });
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };

    loadConfig();
  }, [form]);

  const onSubmit = async (data: MeetingConfigData) => {
    if (!currentConfig) return;

    setIsLoading(true);

    try {
      const updatedConfig: MeetingConfig = {
        ...currentConfig,
        ...data,
        availability: {
          ...currentConfig.availability,
          ...data.availability,
        },
        emailTemplates: currentConfig.emailTemplates, // Preserve existing templates
      };

      await ConfigStorage.save(updatedConfig);
      setCurrentConfig(updatedConfig);

      toast({
        title: 'Configuration Updated',
        description: 'Meeting configuration has been saved successfully.',
      });

      onConfigUpdate?.(updatedConfig);

    } catch (error) {
      console.error('Error updating configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to update configuration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = async () => {
    try {
      await ConfigStorage.reset();
      const defaultConfig = await ConfigStorage.get();
      setCurrentConfig(defaultConfig);
      form.reset({
        availability: defaultConfig.availability,
        durations: defaultConfig.durations,
        meetingTypes: defaultConfig.meetingTypes,
        defaultPhoneNumber: defaultConfig.defaultPhoneNumber || '',
        autoGenerateGoogleMeet: defaultConfig.autoGenerateGoogleMeet,
        reminderHours: defaultConfig.reminderHours,
      });

      toast({
        title: 'Reset to Defaults',
        description: 'Configuration has been reset to default values.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset configuration.',
        variant: 'destructive',
      });
    }
  };

  const weekDays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const durationOptions: MeetingDuration[] = [15, 30, 60];
  const meetingTypeOptions: { value: MeetingType; label: string }[] = [
    { value: 'google-meet', label: 'Google Meet' },
    { value: 'phone', label: 'Phone Call' },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Meeting Configuration
        </CardTitle>
        <CardDescription>
          Configure meeting availability, durations, and other settings for your scheduling system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="availability" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="meetings">Meetings</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Availability Settings */}
              <TabsContent value="availability" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Working Hours
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="availability.startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            When your availability starts each day (IST)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availability.endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            When your availability ends each day (IST)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="availability.slotDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Slot Interval</FormLabel>
                          <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select interval" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How often time slots are available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availability.bufferTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buffer Time (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="60"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Break time between meetings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Working Days
                    </h4>
                    
                    <FormField
                      control={form.control}
                      name="availability.workingDays"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {weekDays.map((day) => (
                              <FormField
                                key={day.value}
                                control={form.control}
                                name="availability.workingDays"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={day.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(day.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, day.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== day.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {day.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Meeting Settings */}
              <TabsContent value="meetings" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Meeting Options</h3>

                  <FormField
                    control={form.control}
                    name="durations"
                    render={() => (
                      <FormItem>
                        <FormLabel>Available Durations</FormLabel>
                        <FormDescription>
                          Select which meeting durations users can choose from
                        </FormDescription>
                        <div className="grid grid-cols-3 gap-4">
                          {durationOptions.map((duration) => (
                            <FormField
                              key={duration}
                              control={form.control}
                              name="durations"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={duration}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(duration)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, duration])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== duration
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {duration} minutes
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meetingTypes"
                    render={() => (
                      <FormItem>
                        <FormLabel>Meeting Types</FormLabel>
                        <FormDescription>
                          Select which meeting types are available
                        </FormDescription>
                        <div className="grid grid-cols-2 gap-4">
                          {meetingTypeOptions.map((type) => (
                            <FormField
                              key={type.value}
                              control={form.control}
                              name="meetingTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, type.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== type.value
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {type.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Meeting Settings
                    </h4>

                    <FormField
                      control={form.control}
                      name="defaultPhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormDescription>
                            Phone number to display for phone meetings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Google Meet Settings</h4>

                    <FormField
                      control={form.control}
                      name="autoGenerateGoogleMeet"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Auto-generate Google Meet links
                            </FormLabel>
                            <FormDescription>
                              Automatically create Google Meet links for video meetings
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h3>

                  <FormField
                    control={form.control}
                    name="reminderHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reminder Time</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reminder time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 hour before</SelectItem>
                            <SelectItem value="2">2 hours before</SelectItem>
                            <SelectItem value="4">4 hours before</SelectItem>
                            <SelectItem value="24">24 hours before</SelectItem>
                            <SelectItem value="48">48 hours before</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          When to send reminder emails before meetings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-lg border p-4 space-y-2">
                    <h4 className="font-medium">Email Template Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Email templates for confirmations, reminders, and cancellations can be configured in the Advanced tab.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Storage Settings */}
              <TabsContent value="storage" className="space-y-4">
                <StorageConfigPanel onConfigChange={() => {
                  // Reload meeting config when storage backend changes
                  const loadConfig = async () => {
                    try {
                      const config = await ConfigStorage.get();
                      setCurrentConfig(config);
                      form.reset({
                        availability: config.availability,
                        durations: config.durations,
                        meetingTypes: config.meetingTypes,
                        defaultPhoneNumber: config.defaultPhoneNumber || '',
                        autoGenerateGoogleMeet: config.autoGenerateGoogleMeet,
                        reminderHours: config.reminderHours,
                      });
                    } catch (error) {
                      console.error('Failed to reload config after storage change:', error);
                    }
                  };
                  loadConfig();
                }} />
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Advanced Settings</h3>

                  <FormField
                    control={form.control}
                    name="availability.timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Currently fixed to Asia/Kolkata (IST). Contact support to change.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-lg border p-4 space-y-2">
                    <h4 className="font-medium">Data Management</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage your meeting data and settings.
                    </p>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm">
                        Export Data
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        Import Data
                      </Button>
                      <Button type="button" variant="destructive" size="sm">
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>
              <Button type="submit" disabled={isLoading} className="ml-auto">
                {isLoading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
