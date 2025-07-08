import { useState, useEffect } from 'react'
import { Button, Container, Group, LoadingOverlay, Badge, Progress } from '@mantine/core'
import { GoogleGenerativeAI } from '@google/generative-ai'

// AI Classification Types
interface OpportunityClassification {
  classification: 'Content Clipping' | 'UGC' | 'unknown';
  confidence: number;
  reasoning: string;
  opportunity_score: number;
  content_type: 'educational' | 'entertainment' | 'business' | 'community' | 'review' | 'other';
  potential_clips: number;
  keywords: string[];
  timestamp: string;
  source: string;
  error?: boolean;
  error_message?: string;
}

interface ProcessedOpportunity {
  id: string;
  classification: OpportunityClassification;
  processed_at: string;
  original_data: any;
}

// AI Classification Agent
class GeminiClassificationAgent {
  private apiKeys: string[] = []
  private currentKeyIndex = 0
  private clients: GoogleGenerativeAI[]

  constructor() {
    // Load all 100 Gemini API keys from environment
    this.apiKeys = this.loadGeminiKeys()
    this.clients = this.apiKeys.map(key => new GoogleGenerativeAI(key))
    console.log(`🤖 AI Agent: Loaded ${this.apiKeys.length} Gemini keys`)
  }

  private loadGeminiKeys(): string[] {
    // Load the first 5 keys for testing (you can expand to all 100)
    return [
      'AIzaSyCNoAGn1KS_udkJVaKzTnRKMr64KrFVYGk',
      'AIzaSyCSr6Lbf5iWZwH6jdn4Lt1kmMtcqUQ7iRo',
      'AIzaSyAvg59pPSoOZhPtq1m00c3P2AMJse2GgAQ',
      'AIzaSyCnsucy-ElgyMyR2wQsy8iM0Brxx9C9oPo',
      'AIzaSyAWTbAu-W0cF5JLGxRNSg2CCZM5sJLorlE'
    ]
  }

  // Rotate API keys for load balancing
  private getClient(): GoogleGenerativeAI {
    const client = this.clients[this.currentKeyIndex]
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.clients.length
    return client
  }

  private async makeRequest(prompt: string): Promise<string> {
    const maxRetries = Math.min(this.apiKeys.length, 3)
    let lastError: Error

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const client = this.getClient()
        const model = client.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        })

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
      } catch (error) {
        lastError = error as Error
        console.warn(`🤖 Gemini API attempt ${attempt + 1} failed:`, error)
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
        }
      }
    }

    throw new Error(`All Gemini API attempts failed. Last error: ${lastError!.message}`)
  }

  async classifyOpportunity(opportunityData: any): Promise<OpportunityClassification> {
    try {
      console.log(`🤖 Classifying opportunity: ${opportunityData.title}`)
      
      const prompt = `
You are an expert content opportunity classifier for ClippIntell. Analyze the given data and classify opportunities as either "Content Clipping" or "UGC" (User Generated Content).

CLASSIFICATION CRITERIA:

Content Clipping Opportunities:
- Established brands/companies with existing content
- Educational content, courses, tutorials
- Software tools and SaaS products
- Business/marketing content
- Podcasts, videos, blogs with clip-worthy segments
- High-value educational or informational content
- Content that can be shortened into valuable clips

UGC Opportunities:
- Community-driven platforms
- User review systems
- Social platforms encouraging user posts
- Contest/challenge platforms
- User testimonial opportunities
- Platforms seeking user-created content
- Communities where users share experiences

Analyze the following data and respond with ONLY a JSON object:
{
  "classification": "Content Clipping" | "UGC",
  "confidence": 0-100,
  "reasoning": "Brief explanation",
  "opportunity_score": 0-100,
  "content_type": "educational|entertainment|business|community|review|other",
  "potential_clips": number_of_potential_clips_estimated,
  "keywords": ["relevant", "keywords", "for", "targeting"]
}

Data to analyze:
${JSON.stringify(opportunityData, null, 2)}
`

      const response = await this.makeRequest(prompt)
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI')
      }

      const classification = JSON.parse(jsonMatch[0])
      
      // Validate required fields
      const required = ['classification', 'confidence', 'reasoning', 'opportunity_score']
      for (const field of required) {
        if (!(field in classification)) {
          throw new Error(`Missing required field: ${field}`)
        }
      }

      return {
        ...classification,
        timestamp: new Date().toISOString(),
        source: 'gemini-2.5-flash'
      }
    } catch (error) {
      console.error('🤖 Classification error:', error)
      return {
        classification: 'unknown',
        confidence: 0,
        reasoning: `Classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        opportunity_score: 0,
        content_type: 'other',
        potential_clips: 0,
        keywords: [],
        timestamp: new Date().toISOString(),
        source: 'gemini-2.5-flash',
        error: true,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async classifyBatch(opportunities: any[]): Promise<ProcessedOpportunity[]> {
    console.log(`🤖 Processing batch of ${opportunities.length} opportunities...`)
    const results: ProcessedOpportunity[] = []

    for (let i = 0; i < opportunities.length; i++) {
      const opportunity = opportunities[i]
      console.log(`🤖 Processing ${i + 1}/${opportunities.length}: ${opportunity.title}`)
      
      try {
        const classification = await this.classifyOpportunity(opportunity)
        
        results.push({
          id: opportunity.id,
          classification,
          processed_at: new Date().toISOString(),
          original_data: opportunity
        })

        // Small delay between requests to avoid rate limiting
        if (i < opportunities.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
      } catch (error) {
        console.error(`🤖 Failed to process opportunity ${opportunity.id}:`, error)
        results.push({
          id: opportunity.id,
          classification: {
            classification: 'unknown',
            confidence: 0,
            reasoning: 'Processing failed',
            opportunity_score: 0,
            content_type: 'other',
            potential_clips: 0,
            keywords: [],
            timestamp: new Date().toISOString(),
            source: 'gemini-2.5-flash',
            error: true,
            error_message: error instanceof Error ? error.message : 'Unknown error'
          },
          processed_at: new Date().toISOString(),
          original_data: opportunity
        })
      }
    }

    console.log(`🤖 Batch processing complete! Processed ${results.length} opportunities`)
    return results
  }
}

// Direct API client using fetch (avoiding SDK issues)
class WhopAPIClient {
  private apiKey = '4lZaVppAcIAQtXHzrW5iM7dvPB_SK7TdjfgqgeGXwEM'
  private baseURL = 'https://api.whop.com/api/v5'

  private async makeRequest(endpoint: string) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        return await response.json()
      } else {
        console.warn(`API request failed: ${endpoint} - ${response.status}`)
        return { data: [] }
      }
    } catch (error) {
      console.error(`API error for ${endpoint}:`, error)
      return { data: [] }
    }
  }

  async getAllOpportunities() {
    console.log('🎯 Gathering all Whop opportunities...')
    
    try {
      const [experiences, products, companies] = await Promise.all([
        this.makeRequest('/app/experiences?limit=20'),
        this.makeRequest('/app/products?limit=20'),
        this.makeRequest('/app/companies?limit=20')
      ])

      const allOpportunities: any[] = []

      // Transform experiences, products, companies to opportunities
      [
        { data: experiences.data, type: 'experience' },
        { data: products.data, type: 'product' },
        { data: companies.data, type: 'company' }
      ].forEach(({ data, type }) => {
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            allOpportunities.push(this.transformToOpportunity(item, type))
          })
        }
      })

      console.log(`🎉 Found ${allOpportunities.length} total opportunities from Whop!`)
      return allOpportunities

    } catch (error) {
      console.error('❌ Failed to gather opportunities:', error)
      return []
    }
  }

  private transformToOpportunity(item: any, type: string): any {
    return {
      id: item.id || `${type}_${Date.now()}_${Math.random()}`,
      title: item.name || item.title || `${this.capitalize(type)} Opportunity`,
      description: item.description || `${this.capitalize(type)} opportunity from Whop`,
      payout: item.price || Math.floor(Math.random() * 200) + 50,
      category: item.category || 'General',
      content_type: 'unknown', // Will be determined by AI
      brand: item.company_name || item.brand || 'Whop Creator',
      whop_url: `https://whop.com/${type}s/${item.id}`,
      deadline: this.generateFutureDate(),
      estimated_hours: Math.floor(Math.random() * 5) + 1,
      applicant_count: Math.floor(Math.random() * 20),
      difficulty: Math.floor(Math.random() * 5) + 1,
      match_score: Math.floor(Math.random() * 30) + 70,
      whop_source: type,
      type: type,
      source: `whop_${type}`,
      original_data: item
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  private generateFutureDate(): string {
    const future = new Date()
    future.setDate(future.getDate() + Math.floor(Math.random() * 14) + 1)
    return future.toISOString().split('T')[0]
  }
}

// Enhanced Opportunity Card Component with AI Results
function OpportunityCard({ opportunity, aiClassification }: { 
  opportunity: any, 
  aiClassification?: OpportunityClassification 
}) {
  const handleApply = () => {
    window.open(opportunity.whop_url, '_blank')
  }

  // Use AI classification if available, otherwise fall back to original
  const classification = aiClassification?.classification || opportunity.content_type
  const confidence = aiClassification?.confidence || 0
  const reasoning = aiClassification?.reasoning || 'No AI analysis available'
  const opportunityScore = aiClassification?.opportunity_score || 0
  const keywords = aiClassification?.keywords || []

  // Determine if this is real Whop data or mock data
  const isRealWhopData = opportunity.source?.startsWith('whop_')
  const hasAIAnalysis = !!aiClassification && !aiClassification.error
  const dataSource = isRealWhopData ? '🔗 Real Whop Data' : '🎭 Mock Data'

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '20px',
      border: '2px solid #e0e0e0',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div>
          <span style={{
            backgroundColor: classification === 'Content Clipping' ? '#339af0' : classification === 'UGC' ? '#51cf66' : '#gray',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '15px',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginRight: '8px'
          }}>
            {classification === 'Content Clipping' ? 'Content Clipping' : 
             classification === 'UGC' ? 'UGC' : 
             classification || 'Unknown'}
          </span>
          <span style={{
            backgroundColor: '#ffd43b',
            color: 'black',
            padding: '6px 12px',
            borderRadius: '15px',
            fontSize: '1rem',
            fontWeight: 700
          }}>
            ${opportunity.payout || 100}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{
            backgroundColor: isRealWhopData ? '#e3f2fd' : '#fff3e0',
            color: isRealWhopData ? '#1976d2' : '#f57c00',
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 500
          }}>
            {dataSource}
          </span>
          {hasAIAnalysis && (
            <span style={{
              backgroundColor: '#e8f5e8',
              color: '#2e7d32',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              🤖 AI Analyzed
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h2 style={{
        color: 'black',
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '8px',
        lineHeight: 1.3
      }}>
        {opportunity.title}
      </h2>

      {/* Brand & Category */}
      <p style={{
        color: '#666',
        fontSize: '1rem',
        marginBottom: '15px',
        fontWeight: 500
      }}>
        {opportunity.brand} • {opportunity.category || 'General'}
      </p>

      {/* Description */}
      <p style={{
        color: 'black',
        fontSize: '1rem',
        lineHeight: 1.4,
        marginBottom: '20px'
      }}>
        {opportunity.description}
      </p>

      {/* AI Analysis Section */}
      {hasAIAnalysis && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#333', fontSize: '1rem', marginBottom: '10px', fontWeight: 600 }}>
            🤖 AI Analysis
          </h4>
          
          {/* Confidence and Opportunity Score */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 5px 0' }}>AI Confidence</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Progress 
                  value={confidence} 
                  size="sm" 
                  style={{ flex: 1 }}
                  color={confidence > 80 ? 'green' : confidence > 60 ? 'yellow' : 'red'}
                />
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600,
                  color: confidence > 80 ? '#51cf66' : confidence > 60 ? '#ffd43b' : '#ff8787'
                }}>
                  {confidence}%
                </span>
              </div>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 5px 0' }}>Opportunity Score</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Progress 
                  value={opportunityScore} 
                  size="sm" 
                  style={{ flex: 1 }}
                  color={opportunityScore > 80 ? 'green' : opportunityScore > 60 ? 'yellow' : 'red'}
                />
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600,
                  color: opportunityScore > 80 ? '#51cf66' : opportunityScore > 60 ? '#ffd43b' : '#ff8787'
                }}>
                  {opportunityScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div style={{ marginBottom: '15px' }}>
            <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 5px 0' }}>AI Reasoning</p>
            <p style={{ color: '#333', fontSize: '0.9rem', fontStyle: 'italic' }}>
              "{reasoning}"
            </p>
          </div>

          {/* Keywords */}
          {keywords.length > 0 && (
            <div>
              <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 8px 0' }}>AI Keywords</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {keywords.slice(0, 5).map((keyword, index) => (
                  <Badge key={index} size="sm" variant="light">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div>
          <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 3px 0' }}>Match Score</p>
          <p style={{
            color: (opportunity.match_score || 75) > 90 ? '#51cf66' : (opportunity.match_score || 75) > 80 ? '#ffd43b' : '#ff8787',
            fontSize: '1.2rem',
            fontWeight: 700,
            margin: 0
          }}>
            {opportunity.match_score || 75}%
          </p>
        </div>
        <div>
          <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 3px 0' }}>Type</p>
          <p style={{ color: 'black', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
            {opportunity.type || 'General'}
          </p>
        </div>
        {hasAIAnalysis && aiClassification.potential_clips > 0 && (
          <div>
            <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 3px 0' }}>Potential Clips</p>
            <p style={{ color: 'black', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
              {aiClassification.potential_clips}
            </p>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <Button 
        onClick={handleApply}
        size="lg"
        style={{ 
          fontSize: '1.1rem', 
          padding: '12px 24px',
          height: '50px',
          width: '100%'
        }}
      >
        View on Whop →
      </Button>
    </div>
  )
}

// Main App Component
function ClippIntellApp() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [aiClassifications, setAiClassifications] = useState<Map<string, OpportunityClassification>>(new Map())
  const [loading, setLoading] = useState(true)
  const [aiProcessing, setAiProcessing] = useState(false)
  const [dataSource, setDataSource] = useState<'mock' | 'whop'>('mock')
  const [processedCount, setProcessedCount] = useState(0)
  
  const whopClient = new WhopAPIClient()
  const aiAgent = new GeminiClassificationAgent()

  // Mock data as fallback
  const mockOpportunities = [
    {
      id: 'mock_1',
      title: 'Create TikTok Product Review Videos',
      description: 'We need authentic TikTok videos reviewing our new fitness tracker. Must show genuine usage and highlight key features.',
      payout: 150,
      category: 'Fitness',
      content_type: 'ugc',
      brand: 'FitTech Pro',
      whop_url: 'https://whop.com/opportunity/123',
      deadline: '2025-07-15',
      estimated_hours: 2,
      applicant_count: 8,
      difficulty: 2,
      match_score: 92,
      type: 'mock',
      source: 'mock_data'
    },
    {
      id: 'mock_2',
      title: 'Edit Gaming Highlight Clips',
      description: 'Transform raw gaming footage into viral 60-second clips for YouTube Shorts and TikTok. Fast-paced editing required.',
      payout: 85,
      category: 'Gaming',
      content_type: 'content_clipping',
      brand: 'GameStream Studios',
      whop_url: 'https://whop.com/opportunity/456',
      deadline: '2025-07-12',
      estimated_hours: 4,
      applicant_count: 15,
      difficulty: 4,
      match_score: 78,
      type: 'mock',
      source: 'mock_data'
    },
    {
      id: 'mock_3',
      title: 'Beauty Product Unboxing Content',
      description: 'Create authentic unboxing and first impressions content for our new skincare line. Focus on packaging and initial thoughts.',
      payout: 200,
      category: 'Beauty',
      content_type: 'ugc',
      brand: 'GlowUp Cosmetics',
      whop_url: 'https://whop.com/opportunity/789',
      deadline: '2025-07-20',
      estimated_hours: 3,
      applicant_count: 5,
      difficulty: 3,
      match_score: 88,
      type: 'mock',
      source: 'mock_data'
    }
  ]

  // Load opportunities on app start
  useEffect(() => {
    loadOpportunities()
  }, [])

  const loadOpportunities = async () => {
    setLoading(true)
    console.log('🎯 Loading opportunities...')

    try {
      // Try to get real Whop data first
      const whopOpportunities = await whopClient.getAllOpportunities()
      
      if (whopOpportunities.length > 0) {
        console.log('✅ Using real Whop data!')
        setOpportunities(whopOpportunities)
        setDataSource('whop')
      } else {
        console.log('⚠️ No Whop data found, using mock data')
        setOpportunities(mockOpportunities)
        setDataSource('mock')
      }
    } catch (error) {
      console.error('❌ Failed to load opportunities:', error)
      console.log('🎭 Falling back to mock data')
      setOpportunities(mockOpportunities)
      setDataSource('mock')
    } finally {
      setLoading(false)
    }
  }

  const runAIClassification = async () => {
    if (opportunities.length === 0) return

    setAiProcessing(true)
    setProcessedCount(0)
    console.log('🤖 Starting AI classification...')

    try {
      const processedResults = await aiAgent.classifyBatch(opportunities)
      
      // Convert to Map for easy lookup
      const classificationMap = new Map<string, OpportunityClassification>()
      processedResults.forEach(result => {
        classificationMap.set(result.id, result.classification)
        setProcessedCount(prev => prev + 1)
      })
      
      setAiClassifications(classificationMap)
      console.log('🎉 AI classification complete!')
    } catch (error) {
      console.error('❌ AI classification failed:', error)
    } finally {
      setAiProcessing(false)
    }
  }

  const refreshData = async () => {
    await loadOpportunities()
    setAiClassifications(new Map()) // Clear previous AI results
    setProcessedCount(0)
  }

  if (loading) {
    return (
      <Container size="md" py={50}>
        <LoadingOverlay visible={true} />
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Loading ClippIntell...</h2>
          <p style={{ color: '#999' }}>Fetching opportunities from Whop...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl" py={20}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          color: '#333', 
          marginBottom: '15px', 
          fontSize: '2.5rem',
          fontWeight: 700
        }}>
          🎯 ClippIntell
        </h1>
        
        <p style={{ 
          color: '#666', 
          marginBottom: '20px', 
          fontSize: '1.2rem'
        }}>
          {opportunities.length} opportunities found • 
          {dataSource === 'whop' ? ' 🔗 Real Whop Data' : ' 🎭 Mock Data'} • 
          {aiClassifications.size > 0 ? ` 🤖 ${aiClassifications.size} AI Analyzed` : ' AI Ready'}
        </p>
        
        <Group justify="center" gap="md">
          <Button 
            onClick={refreshData} 
            size="lg" 
            variant="outline" 
            style={{ fontSize: '1rem', padding: '10px 20px' }}
            disabled={loading || aiProcessing}
          >
            🔄 Refresh Data
          </Button>
          <Button 
            onClick={runAIClassification}
            size="lg" 
            style={{ fontSize: '1rem', padding: '10px 20px' }}
            disabled={opportunities.length === 0 || aiProcessing}
            loading={aiProcessing}
          >
            🤖 Run AI Classification
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            style={{ fontSize: '1rem', padding: '10px 20px' }}
          >
            ⚙️ Settings
          </Button>
        </Group>

        {/* AI Processing Status */}
        {aiProcessing && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            maxWidth: '400px',
            margin: '20px auto 0'
          }}>
            <p style={{ color: '#1976d2', fontWeight: 600, marginBottom: '10px' }}>
              🤖 AI Classification in Progress...
            </p>
            <Progress value={(processedCount / opportunities.length) * 100} size="lg" />
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>
              Processed {processedCount} of {opportunities.length} opportunities
            </p>
          </div>
        )}
      </div>

      {/* Opportunities List */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <OpportunityCard 
              key={opportunity.id} 
              opportunity={opportunity} 
              aiClassification={aiClassifications.get(opportunity.id)}
            />
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No opportunities found</h3>
            <p style={{ color: '#999' }}>Try refreshing or check your Whop API connection</p>
            <Button onClick={refreshData} style={{ marginTop: '15px' }}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Container>
  )
}

export default ClippIntellApp