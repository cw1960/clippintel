import { useSettingsStore } from '../stores/settingsStore';

const DEFAULT_WHOP_API_KEY = import.meta.env.VITE_WHOP_API_KEY || '';
const WHOP_BASE_URL = 'https://api.whop.com/v1';

interface WhopApiResponse<T = any> {
  data: T | null;
  success: boolean;
  error?: string;
}

interface WhopOpportunity {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  value?: number;
  deadline?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

class WhopApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.baseUrl = WHOP_BASE_URL;
    this.apiKey = apiKey || this.getApiKey();
  }

  private getApiKey(): string {
    const settings = useSettingsStore.getState().integrations;
    return settings.whopApiKey || DEFAULT_WHOP_API_KEY;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WhopApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error('Whop API request failed:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Opportunities
  async getOpportunities(
    filters?: {
      category?: string;
      minValue?: number;
      maxValue?: number;
      keywords?: string[];
      limit?: number;
      offset?: number;
    }
  ): Promise<WhopApiResponse<WhopOpportunity[]>> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minValue) params.append('min_value', filters.minValue.toString());
    if (filters?.maxValue) params.append('max_value', filters.maxValue.toString());
    if (filters?.keywords) params.append('keywords', filters.keywords.join(','));
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/opportunities${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<WhopOpportunity[]>(endpoint);
  }

  async getOpportunity(id: string): Promise<WhopApiResponse<WhopOpportunity>> {
    return this.makeRequest<WhopOpportunity>(`/opportunities/${id}`);
  }

  async searchOpportunities(
    query: string,
    filters?: {
      category?: string;
      minValue?: number;
      maxValue?: number;
      limit?: number;
    }
  ): Promise<WhopApiResponse<WhopOpportunity[]>> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minValue) params.append('min_value', filters.minValue.toString());
    if (filters?.maxValue) params.append('max_value', filters.maxValue.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/opportunities/search?${queryString}`;

    return this.makeRequest<WhopOpportunity[]>(endpoint);
  }

  // Categories
  async getCategories(): Promise<WhopApiResponse<string[]>> {
    return this.makeRequest<string[]>('/categories');
  }

  // Webhooks
  async createWebhook(
    url: string,
    events: string[]
  ): Promise<WhopApiResponse<{ id: string; url: string; events: string[] }>> {
    return this.makeRequest('/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        url,
        events,
      }),
    });
  }

  async deleteWebhook(id: string): Promise<WhopApiResponse<void>> {
    return this.makeRequest(`/webhooks/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async ping(): Promise<WhopApiResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest('/ping');
  }

  // Update API key
  updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
  }
}

// Export singleton instance
export const whopApi = new WhopApiService();

// Export class for custom instances
export default WhopApiService; 