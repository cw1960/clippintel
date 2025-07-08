class WhopAPIClient {
    private apiKey: string
    private baseURL = 'https://api.whop.com/api/v5'
    private companyId: string
  
    constructor() {
      this.apiKey = import.meta.env.WHOP_API_KEY || process.env.WHOP_API_KEY || ''
      this.companyId = import.meta.env.VITE_WHOP_COMPANY_ID || process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || ''
      
      if (!this.apiKey) {
        throw new Error('WHOP_API_KEY is required')
      }
    }
  
    private async makeRequest(endpoint: string, options: RequestInit = {}) {
      const url = `${this.baseURL}${endpoint}`
      
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
  
      try {
        console.log(`🔄 Whop API Request: ${url}`)
        const response = await fetch(url, {
          ...options,
          headers
        })
  
        if (response.status === 429) {
          console.log('⏳ Rate limited by Whop API, waiting...')
          await new Promise(resolve => setTimeout(resolve, 10000))
          return this.makeRequest(endpoint, options)
        }
  
        if (!response.ok) {
          throw new Error(`Whop API Error: ${response.status} ${response.statusText}`)
        }
  
        const data = await response.json()
        console.log(`✅ Whop API Success:`, data)
        return data
      } catch (error) {
        console.error('❌ Whop API Error:', error)
        throw error
      }
    }
  
    // Get content rewards/opportunities
    async getContentRewards(params: {
      limit?: number
      offset?: number
      status?: string
    } = {}) {
      const searchParams = new URLSearchParams()
      
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.offset) searchParams.append('offset', params.offset.toString())
      if (params.status) searchParams.append('status', params.status)
  
      const endpoint = `/content-rewards?${searchParams.toString()}`
      return this.makeRequest(endpoint)
    }

    // Test method to discover available endpoints
    async testAvailableEndpoints() {
      console.log('🔍 Testing Whop API v5 endpoints...');
      
      const endpoints = [
        '/companies',
        '/products', 
        '/memberships',
        '/content-rewards',
        '/campaigns',
        '/experiences',
        '/apps',
        '/users/me',
        '/webhooks'
      ];
      
      const results: { [key: string]: any } = {};
      
      for (const endpoint of endpoints) {
        try {
          const result = await this.makeRequest(endpoint + '?limit=1');
          console.log(`✅ ${endpoint}:`, result);
          results[endpoint] = { success: true, data: result };
        } catch (error) {
          console.log(`❌ ${endpoint}:`, error instanceof Error ? error.message : 'Unknown error');
          results[endpoint] = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
        
        // Wait between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return results;
    }

    // Test specific company endpoints
    async testCompanyEndpoints() {
      if (!this.companyId) {
        console.log('❌ No company ID available for testing');
        return;
      }
      
      console.log(`🔍 Testing company-specific endpoints for company: ${this.companyId}`);
      
      const companyEndpoints = [
        `/companies/${this.companyId}`,
        `/companies/${this.companyId}/products`,
        `/companies/${this.companyId}/members`,
        `/companies/${this.companyId}/analytics`,
        `/companies/${this.companyId}/content-rewards`
      ];
      
      const results: { [key: string]: any } = {};
      
      for (const endpoint of companyEndpoints) {
        try {
          const result = await this.makeRequest(endpoint + (endpoint.includes('?') ? '&limit=1' : '?limit=1'));
          console.log(`✅ ${endpoint}:`, result);
          results[endpoint] = { success: true, data: result };
        } catch (error) {
          console.log(`❌ ${endpoint}:`, error instanceof Error ? error.message : 'Unknown error');
          results[endpoint] = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
        
        // Wait between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return results;
    }
  
    // Test API connection
    async testConnection() {
      try {
        console.log('🧪 Testing Whop API connection...')
        const result = await this.getContentRewards({ limit: 1 })
        console.log('🎉 Whop API connection successful!')
        return { success: true, data: result }
      } catch (error) {
        console.error('💥 Whop API connection failed:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
  
  export const whopApi = new WhopAPIClient()