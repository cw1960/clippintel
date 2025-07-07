export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;

  // Related entities
  entityType?: "opportunity" | "user" | "criteria" | "system";
  entityId?: string;

  // Action data
  action?: {
    type: "view" | "apply" | "dismiss" | "snooze" | "mark_read";
    url?: string;
    label?: string;
    data?: Record<string, any>;
  };

  // Metadata
  metadata?: {
    source?: string;
    category?: string;
    tags?: string[];
    imageUrl?: string;
    iconUrl?: string;
    color?: string;
    data?: Record<string, any>;
  };
}

// Replace enums with union types
export type NotificationType =
  | "new_opportunity"
  | "opportunity_match"
  | "opportunity_updated"
  | "opportunity_expired"
  | "deadline_reminder"
  | "application_status"
  | "criteria_match"
  | "criteria_updated"
  | "system_update"
  | "maintenance"
  | "feature_announcement"
  | "account_activity"
  | "security_alert"
  | "subscription_update"
  | "team_invitation"
  | "team_update"
  | "user_mention"
  | "custom";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface NotificationChannel {
  id: string;
  userId: string;
  type: "email" | "push" | "sms" | "webhook" | "slack" | "discord";
  name: string;
  isActive: boolean;
  config: {
    // Email config
    email?: {
      address: string;
      template?: string;
      frequency: "immediate" | "daily" | "weekly";
    };

    // Push config
    push?: {
      endpoint: string;
      keys: {
        p256dh: string;
        auth: string;
      };
      sound?: boolean;
      vibration?: boolean;
    };

    // SMS config
    sms?: {
      phoneNumber: string;
      provider: "twilio" | "aws" | "custom";
      template?: string;
    };

    // Webhook config
    webhook?: {
      url: string;
      method: "POST" | "PUT" | "PATCH";
      headers?: Record<string, string>;
      secret?: string;
    };

    // Slack config
    slack?: {
      webhookUrl: string;
      channel: string;
      username?: string;
      iconEmoji?: string;
    };

    // Discord config
    discord?: {
      webhookUrl: string;
      username?: string;
      avatarUrl?: string;
    };
  };

  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}

export interface NotificationRule {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;

  // Conditions
  conditions: {
    types: NotificationType[];
    priorities: NotificationPriority[];
    entities?: {
      type: "opportunity" | "user" | "criteria";
      ids?: string[];
      categories?: string[];
      tags?: string[];
    };
    timeRange?: {
      startTime: string; // HH:MM format
      endTime: string; // HH:MM format
      timezone: string;
      days: number[]; // 0-6, Sunday = 0
    };
    frequency?: {
      type: "immediate" | "batched" | "scheduled";
      interval?: number; // in minutes
      maxPerHour?: number;
      maxPerDay?: number;
    };
  };

  // Actions
  actions: {
    channels: string[]; // NotificationChannel ids
    template?: string;
    customMessage?: string;
    delay?: number; // in minutes
    snooze?: {
      duration: number; // in minutes
      maxRetries: number;
    };
    grouping?: {
      enabled: boolean;
      field: "type" | "entity" | "category";
      maxSize: number;
      timeout: number; // in minutes
    };
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  description?: string;
  type: NotificationType;
  channel: "email" | "push" | "sms" | "webhook" | "slack" | "discord";
  language: string;

  // Template content
  content: {
    subject?: string; // for email
    title: string;
    body: string;
    footer?: string;

    // Rich content
    html?: string; // for email
    markdown?: string;

    // Media
    imageUrl?: string;
    iconUrl?: string;

    // Interactive elements
    buttons?: {
      text: string;
      url: string;
      style: "primary" | "secondary" | "danger";
    }[];

    // Variables
    variables?: string[];

    // Styling
    style?: {
      color?: string;
      backgroundColor?: string;
      borderColor?: string;
      fontSize?: string;
      fontWeight?: string;
    };
  };

  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationBatch {
  id: string;
  userId: string;
  type: "scheduled" | "grouped" | "digest";
  notifications: string[]; // notification ids
  status: "pending" | "processing" | "sent" | "failed";
  scheduledFor: Date;
  sentAt?: Date;

  // Batch config
  config: {
    channel: string; // NotificationChannel id
    template?: string;
    groupBy?: "type" | "entity" | "category";
    maxSize: number;
    subject?: string;
    title?: string;
  };

  // Delivery info
  delivery?: {
    attempts: number;
    lastAttempt?: Date;
    error?: string;
    response?: any;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: NotificationType;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    webhook: boolean;
    slack: boolean;
    discord: boolean;
  };
  frequency: "immediate" | "daily" | "weekly" | "monthly" | "never";
  quietHours?: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
  filters?: {
    priorities: NotificationPriority[];
    categories?: string[];
    tags?: string[];
    entities?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationAnalytics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };

  // Counts
  total: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  byChannel: Record<string, number>;

  // Engagement
  readRate: number;
  clickRate: number;
  unsubscribeRate: number;

  // Delivery
  deliveryRate: number;
  failureRate: number;
  averageDeliveryTime: number;

  // Trends
  dailyTrends: {
    date: Date;
    sent: number;
    read: number;
    clicked: number;
    failed: number;
  }[];

  // Top performing
  topTypes: {
    type: NotificationType;
    count: number;
    readRate: number;
    clickRate: number;
  }[];

  topChannels: {
    channel: string;
    count: number;
    deliveryRate: number;
    readRate: number;
  }[];
}
