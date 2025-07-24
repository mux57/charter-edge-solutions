import type { IEmailTemplateStorage, IStorageAdapter, QueryOptions } from '../types';
import type { EmailTemplate } from '@/types/meeting';

/**
 * Email template storage service implementation
 */
export class EmailTemplateStorageService implements IEmailTemplateStorage {
  constructor(private adapter: IStorageAdapter<EmailTemplate>) {}

  // Basic CRUD operations
  async create(data: EmailTemplate): Promise<EmailTemplate> {
    // Validate template data
    this.validateTemplate(data);
    
    return await this.adapter.create(data);
  }

  async getById(id: string): Promise<EmailTemplate | null> {
    return await this.adapter.getById(id);
  }

  async getAll(options?: QueryOptions): Promise<EmailTemplate[]> {
    return await this.adapter.getAll(options);
  }

  async update(id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    if (data.type || data.subject || data.body) {
      // Validate if updating critical fields
      const existing = await this.getById(id);
      if (existing) {
        const updated = { ...existing, ...data };
        this.validateTemplate(updated);
      }
    }
    
    return await this.adapter.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.adapter.delete(id);
  }

  async createMany(data: EmailTemplate[]): Promise<EmailTemplate[]> {
    // Validate all templates
    data.forEach(template => this.validateTemplate(template));
    
    return await this.adapter.createMany(data);
  }

  async updateMany(updates: Array<{ id: string; data: Partial<EmailTemplate> }>): Promise<EmailTemplate[]> {
    return await this.adapter.updateMany(updates);
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    return await this.adapter.deleteMany(ids);
  }

  async find(query: QueryOptions): Promise<EmailTemplate[]> {
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

  async backup(): Promise<EmailTemplate[]> {
    return await this.adapter.backup();
  }

  async restore(data: EmailTemplate[]): Promise<void> {
    return await this.adapter.restore(data);
  }

  // Email template specific methods
  async getByType(type: EmailTemplate['type']): Promise<EmailTemplate | null> {
    const templates = await this.find({
      where: { type },
    });
    
    return templates.length > 0 ? templates[0] : null;
  }

  async getDefaultTemplates(): Promise<EmailTemplate[]> {
    return [
      {
        id: 'default-confirmation',
        type: 'confirmation',
        subject: 'Meeting Confirmation - {{date}} at {{time}}',
        body: `Dear {{name}},

Your meeting has been successfully scheduled!

Meeting Details:
- Date: {{date}}
- Time: {{time}} IST
- Duration: {{duration}}
- Type: {{meetingType}}

{{joinInstructions}}

If you need to reschedule or cancel this meeting, please contact us as soon as possible.

Best regards,
Meeting Scheduler Team

Booking ID: {{bookingId}}`,
        variables: ['name', 'date', 'time', 'duration', 'meetingType', 'joinInstructions', 'bookingId'],
      },
      {
        id: 'default-reminder',
        type: 'reminder',
        subject: 'Meeting Reminder - Tomorrow at {{time}}',
        body: `Dear {{name}},

This is a friendly reminder about your upcoming meeting:

Meeting Details:
- Date: {{date}}
- Time: {{time}} IST
- Duration: {{duration}}
- Type: {{meetingType}}

{{joinInstructions}}

Please make sure you're available at the scheduled time.

Best regards,
Meeting Scheduler Team

Booking ID: {{bookingId}}`,
        variables: ['name', 'date', 'time', 'duration', 'meetingType', 'joinInstructions', 'bookingId'],
      },
      {
        id: 'default-cancellation',
        type: 'cancellation',
        subject: 'Meeting Cancelled - {{date}} at {{time}}',
        body: `Dear {{name}},

We regret to inform you that your meeting scheduled for {{date}} at {{time}} has been cancelled.

Original Meeting Details:
- Date: {{date}}
- Time: {{time}} IST
- Duration: {{duration}}
- Type: {{meetingType}}

If you would like to reschedule, please contact us or visit our scheduling page.

We apologize for any inconvenience caused.

Best regards,
Meeting Scheduler Team

Booking ID: {{bookingId}}`,
        variables: ['name', 'date', 'time', 'duration', 'meetingType', 'bookingId'],
      },
    ];
  }

  // Template management
  async ensureDefaultTemplates(): Promise<void> {
    const defaultTemplates = await this.getDefaultTemplates();
    
    for (const template of defaultTemplates) {
      const existing = await this.getByType(template.type);
      if (!existing) {
        await this.create(template);
      }
    }
  }

  async resetToDefaults(): Promise<EmailTemplate[]> {
    await this.clear();
    const defaultTemplates = await this.getDefaultTemplates();
    return await this.createMany(defaultTemplates);
  }

  async updateTemplate(type: EmailTemplate['type'], updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    const existing = await this.getByType(type);
    if (!existing) {
      return null;
    }
    
    return await this.update(existing.id, updates);
  }

  // Template validation
  private validateTemplate(template: EmailTemplate): void {
    if (!template.type || !['confirmation', 'reminder', 'cancellation'].includes(template.type)) {
      throw new Error('Invalid template type. Must be confirmation, reminder, or cancellation.');
    }
    
    if (!template.subject || template.subject.trim().length === 0) {
      throw new Error('Template subject is required.');
    }
    
    if (!template.body || template.body.trim().length === 0) {
      throw new Error('Template body is required.');
    }
    
    if (template.subject.length > 200) {
      throw new Error('Template subject must be less than 200 characters.');
    }
    
    if (template.body.length > 5000) {
      throw new Error('Template body must be less than 5000 characters.');
    }
    
    // Validate variables array
    if (!Array.isArray(template.variables)) {
      throw new Error('Template variables must be an array.');
    }
  }

  // Template variable management
  async getAvailableVariables(): Promise<Record<string, string>> {
    return {
      '{{name}}': 'Attendee name',
      '{{email}}': 'Attendee email',
      '{{phone}}': 'Attendee phone number',
      '{{date}}': 'Meeting date',
      '{{time}}': 'Meeting time',
      '{{duration}}': 'Meeting duration',
      '{{meetingType}}': 'Meeting type (Video Call or Phone Call)',
      '{{meetingLink}}': 'Google Meet link (for video calls)',
      '{{phoneNumber}}': 'Phone number (for phone calls)',
      '{{notes}}': 'Additional notes',
      '{{bookingId}}': 'Booking ID',
      '{{joinInstructions}}': 'Meeting join instructions',
    };
  }

  async validateTemplateVariables(template: EmailTemplate): Promise<{
    valid: boolean;
    unusedVariables: string[];
    undefinedVariables: string[];
  }> {
    const availableVariables = await this.getAvailableVariables();
    const availableVarNames = Object.keys(availableVariables);
    
    // Find variables used in subject and body
    const usedVariables = new Set<string>();
    const variableRegex = /\{\{(\w+)\}\}/g;
    
    let match;
    while ((match = variableRegex.exec(template.subject + ' ' + template.body)) !== null) {
      usedVariables.add(`{{${match[1]}}}`);
    }
    
    // Check for undefined variables (used but not available)
    const undefinedVariables = Array.from(usedVariables).filter(
      variable => !availableVarNames.includes(variable)
    );
    
    // Check for unused variables (in template.variables but not used)
    const unusedVariables = template.variables.filter(
      variable => !usedVariables.has(`{{${variable}}}`)
    );
    
    return {
      valid: undefinedVariables.length === 0,
      unusedVariables,
      undefinedVariables,
    };
  }

  // Template preview
  async previewTemplate(
    templateId: string, 
    sampleData: Record<string, string>
  ): Promise<{
    subject: string;
    body: string;
  }> {
    const template = await this.getById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    const availableVariables = await this.getAvailableVariables();
    
    let subject = template.subject;
    let body = template.body;
    
    // Replace variables with sample data
    Object.entries(availableVariables).forEach(([variable, description]) => {
      const value = sampleData[variable] || `[${description}]`;
      const regex = new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g');
      subject = subject.replace(regex, value);
      body = body.replace(regex, value);
    });
    
    return { subject, body };
  }

  // Template statistics
  async getTemplateUsageStats(): Promise<Record<EmailTemplate['type'], {
    templateExists: boolean;
    lastModified?: string;
    variableCount: number;
    characterCount: {
      subject: number;
      body: number;
    };
  }>> {
    const stats: any = {};
    const types: EmailTemplate['type'][] = ['confirmation', 'reminder', 'cancellation'];
    
    for (const type of types) {
      const template = await this.getByType(type);
      
      if (template) {
        stats[type] = {
          templateExists: true,
          lastModified: new Date().toISOString(), // Would be actual last modified date
          variableCount: template.variables.length,
          characterCount: {
            subject: template.subject.length,
            body: template.body.length,
          },
        };
      } else {
        stats[type] = {
          templateExists: false,
          variableCount: 0,
          characterCount: {
            subject: 0,
            body: 0,
          },
        };
      }
    }
    
    return stats;
  }

  // Template export/import
  async exportTemplates(): Promise<string> {
    const templates = await this.getAll();
    return JSON.stringify(templates, null, 2);
  }

  async importTemplates(templatesJson: string): Promise<EmailTemplate[]> {
    try {
      const templates = JSON.parse(templatesJson) as EmailTemplate[];
      
      // Validate all templates
      templates.forEach(template => this.validateTemplate(template));
      
      // Clear existing templates and import new ones
      await this.clear();
      return await this.createMany(templates);
    } catch (error) {
      throw new Error(`Failed to import templates: ${(error as Error).message}`);
    }
  }
}
