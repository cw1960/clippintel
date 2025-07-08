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
  
    // Test API connection
    async testConnection() {
      try {
        console.log('🧪 Testing Whop API connection...')
        const result = await this.getContentRewards({ limit: 1 })
        console.log('🎉 Whop API connection successful!')
        return { success: true, data: result }
      } catch (error) {
        console.error('💥 Whop API connection failed:', error)
        return { success: false, error: error.message }
      }
    }
  }
  
  export const whopApi = new WhopAPIClient()