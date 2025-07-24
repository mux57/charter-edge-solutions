import { format } from 'date-fns';
import type { MeetingBooking, EmailTemplate } from '@/types/meeting';
import { EmailTemplateStorage, ConfigStorage } from '@/lib/storage';
import { generateJoinInstructions, formatPhoneNumber } from '@/lib/meetingLinks';

/**
 * Email service for sending meeting notifications
 * Note: This is a mock implementation for demo purposes.
 * In a real application, you would integrate with an email service like:
 * - SendGrid
 * - Mailgun
 * - AWS SES
 * - Nodemailer with SMTP
 */

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

/**
 * Mock email sending function
 */
const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log email for demo purposes
  console.log('📧 Email sent:', {
    to: emailData.to,
    subject: emailData.subject,
    body: emailData.body.substring(0, 100) + '...',
  });
  
  // Simulate 95% success rate
  return Math.random() > 0.05;
};

/**
 * Template variable replacement
 */
const replaceTemplateVariables = (template: string, booking: MeetingBooking): string => {
  const variables = {
    '{{name}}': booking.name,
    '{{email}}': booking.email,
    '{{phone}}': formatPhoneNumber(booking.phone),
    '{{date}}': format(new Date(booking.date), 'EEEE, MMMM dd, yyyy'),
    '{{time}}': format(new Date(`2000-01-01T${booking.time}:00`), 'h:mm a'),
    '{{duration}}': `${booking.duration} minutes`,
    '{{meetingType}}': booking.meetingType === 'google-meet' ? 'Video Call' : 'Phone Call',
    '{{meetingLink}}': booking.googleMeetLink || 'N/A',
    '{{phoneNumber}}': booking.phoneNumber || 'N/A',
    '{{notes}}': booking.notes || 'No additional notes',
    '{{bookingId}}': booking.id,
    '{{joinInstructions}}': generateJoinInstructions(booking),
  };

  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });

  return result;
};

/**
 * Get email template by type
 */
const getEmailTemplate = (type: EmailTemplate['type']): EmailTemplate | null => {
  const template = EmailTemplateStorage.getByType(type);
  if (template) return template;

  // Return default templates if none configured
  return getDefaultTemplate(type);
};

/**
 * Default email templates
 */
const getDefaultTemplate = (type: EmailTemplate['type']): EmailTemplate => {
  const templates = {
    confirmation: {
      id: 'default-confirmation',
      type: 'confirmation' as const,
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
    reminder: {
      id: 'default-reminder',
      type: 'reminder' as const,
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
    cancellation: {
      id: 'default-cancellation',
      type: 'cancellation' as const,
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
  };

  return templates[type];
};

/**
 * Send confirmation email
 */
export const sendConfirmationEmail = async (booking: MeetingBooking): Promise<boolean> => {
  try {
    const template = getEmailTemplate('confirmation');
    if (!template) return false;

    const emailData: EmailData = {
      to: booking.email,
      subject: replaceTemplateVariables(template.subject, booking),
      body: replaceTemplateVariables(template.body, booking),
    };

    const success = await sendEmail(emailData);
    
    if (success) {
      // Mark confirmation as sent
      booking.confirmationSent = true;
      // Note: In a real app, you'd update this in the database
    }

    return success;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

/**
 * Send reminder email
 */
export const sendReminderEmail = async (booking: MeetingBooking): Promise<boolean> => {
  try {
    const template = getEmailTemplate('reminder');
    if (!template) return false;

    const emailData: EmailData = {
      to: booking.email,
      subject: replaceTemplateVariables(template.subject, booking),
      body: replaceTemplateVariables(template.body, booking),
    };

    const success = await sendEmail(emailData);
    
    if (success) {
      // Mark reminder as sent
      booking.reminderSent = true;
      // Note: In a real app, you'd update this in the database
    }

    return success;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
};

/**
 * Send cancellation email
 */
export const sendCancellationEmail = async (booking: MeetingBooking): Promise<boolean> => {
  try {
    const template = getEmailTemplate('cancellation');
    if (!template) return false;

    const emailData: EmailData = {
      to: booking.email,
      subject: replaceTemplateVariables(template.subject, booking),
      body: replaceTemplateVariables(template.body, booking),
    };

    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return false;
  }
};

/**
 * Check for meetings that need reminders
 */
export const checkAndSendReminders = async (): Promise<void> => {
  const config = ConfigStorage.get();
  const reminderHours = config.reminderHours;
  
  // This would typically be called by a background job
  // For demo purposes, we'll just log what would happen
  console.log(`Checking for meetings that need reminders (${reminderHours} hours before)...`);
  
  // In a real implementation:
  // 1. Query for meetings that are scheduled
  // 2. Check if they're within the reminder window
  // 3. Check if reminder hasn't been sent yet
  // 4. Send reminder emails
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Email service status
 */
export const getEmailServiceStatus = (): { available: boolean; provider: string } => {
  return {
    available: true, // Mock service is always available
    provider: 'Mock Email Service (Demo)',
  };
};
