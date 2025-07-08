// src/services/whopApiClient.ts
// Fixed Whop API authentication implementation for ClippIntell

export interface WhopCompany {
    id: string;
    name: string;
    description?: string;
    category?: string;
    url?: string;
    members_count?: number;
    products_count?: number;
    created_at: string;
    avatar?: string;
    banner?: string;
    social_links?: Record<string, string>;
    tags?: string[];
  }
  
  export interface WhopProduct {
    id: string;
    name: string;
    description?: string;
    category?: string;
    price?: number;
    company_id: string;
    created_at: string;
    image?: string;
    features?: string[];
    reviews_count?: number;
    rating?: number;
  }
  
  export interface WhopMembership {
    id: string;
    product_name?: string;
    product_description?: string;
    user_id: string;
    product_id: string;
    status: string;
    created_at: string;
    expires_at?: string;
    plan_type?: string;
    access_level?: string;
    community_features?: boolean;
  }
  
  export interface WhopAPIResponse<T> {
    data: T[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      has_more: boolean;
    };
  }
  
  export class WhopAPIClient {
    private apiKey: string;
    private baseURL = 'https://api.whop.com/api/v2';
    private headers: Record<string, string>;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
      this.headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }
  
    private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      };
  
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Whop API Error: ${response.status} - ${errorData.message || response.statusText}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Whop API Request Failed:', error);
        throw error;
      }
    }
  
    // Get all memberships for content opportunities
    async getMemberships(params: Record<string, any> = {}): Promise<WhopAPIResponse<WhopMembership>> {
      const queryParams = new URLSearchParams(params);
      return this.makeRequest<WhopAPIResponse<WhopMembership>>(`/memberships?${queryParams}`);
    }
  
    // Get companies/products for clipping opportunities
    async getCompanies(params: Record<string, any> = {}): Promise<WhopAPIResponse<WhopCompany>> {
      const queryParams = new URLSearchParams(params);
      return this.makeRequest<WhopAPIResponse<WhopCompany>>(`/companies?${queryParams}`);
    }
  
    // Get specific company details
    async getCompany(companyId: string): Promise<WhopCompany> {
      return this.makeRequest<WhopCompany>(`/companies/${companyId}`);
    }
  
    // Get products from a company
    async getProducts(companyId: string, params: Record<string, any> = {}): Promise<WhopAPIResponse<WhopProduct>> {
      const queryParams = new URLSearchParams(params);
      return this.makeRequest<WhopAPIResponse<WhopProduct>>(`/companies/${companyId}/products?${queryParams}`);
    }
  
    // Get user details
    async getUser(userId: string): Promise<any> {
      return this.makeRequest(`/users/${userId}`);
    }
  
    // Get reviews for a product (UGC opportunities)
    async getReviews(productId: string, params: Record<string, any> = {}): Promise<any> {
      const queryParams = new URLSearchParams(params);
      return this.makeRequest(`/products/${productId}/reviews?${queryParams}`);
    }
  
    // Search for opportunities by keywords
    async searchOpportunities(query: string, type: 'all' | 'companies' | 'products' = 'all'): Promise<{
      companies?: WhopCompany[];
      products?: WhopProduct[];
    }> {
      const params = {
        q: query,
        limit: '50'
      };
  
      const results: { companies?: WhopCompany[]; products?: WhopProduct[] } = {};
  
      if (type === 'companies' || type === 'all') {
        try {
          const companies = await this.getCompanies(params);
          results.companies = companies.data || [];
        } catch (error) {
          console.warn('Failed to search companies:', error);
          results.companies = [];
        }
      }
  
      if (type === 'products' || type === 'all') {
        try {
          // Note: This endpoint may need adjustment based on actual Whop API
          const queryParams = new URLSearchParams(params);
          const products = await this.makeRequest<WhopAPIResponse<WhopProduct>>(`/products/search?${queryParams}`);
          results.products = products.data || [];
        } catch (error) {
          console.warn('Failed to search products:', error);
          results.products = [];
        }
      }
  
      return results;
    }
  
    // Test API connection
    async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
      try {
        const response = await this.makeRequest<WhopAPIResponse<WhopMembership>>('/memberships?limit=1');
        return { 
          success: true, 
          message: 'Whop API connection successful', 
          data: response 
        };
      } catch (error) {
        return { 
          success: false, 
          message: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    }
  }
  
  // Environment configuration
  const getWhopAPIKey = (): string => {
    // For Vite environment variables
    const key = import.meta.env.WHOP_API_KEY || import.meta.env.VITE_WHOP_API_KEY;
    
    if (!key) {
      throw new Error('Whop API key not found. Please set WHOP_API_KEY or VITE_WHOP_API_KEY environment variable.');
    }
    
    return key;
  };
  
  // Initialize client
  export const createWhopClient = (apiKey?: string): WhopAPIClient => {
    const key = apiKey || getWhopAPIKey();
    return new WhopAPIClient(key);
  };
  
  // Default export for convenience
  export default WhopAPIClient;