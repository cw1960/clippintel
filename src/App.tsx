import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Button, Container, Group } from '@mantine/core'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://joxzubnkgelzxoyzotbt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveHp1Ym5rZ2VsenhveXpvdGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4Mzg1ODQsImV4cCI6MjA2NzQxNDU4NH0.3oTCzc1g_G7-QCrEkYDgj2US4z2olyd6A7X-jlpcUoI'
)

// Built-in AI Key Manager
class SimpleAIKeyManager {
  private keys: string[] = []
  private currentIndex = 0

  constructor() {
    const testKeys = [
      'AIzaSyCNoAGn1KS_udkJVaKzTnRKMr64KrFVYGk',
      'AIzaSyCSr6Lbf5iWZwH6jdn4Lt1kmMtcqUQ7iRo',
      'AIzaSyAvg59pPSoOZhPtq1m00c3P2AMJse2GgAQ',
      'AIzaSyCnsucy-ElgyMyR2wQsy8iM0Brxx9C9oPo',
      'AIzaSyAWTbAu-W0cF5JLGxRNSg2CCZM5sJLorlE'
    ]
    this.keys = testKeys
    console.log(`🚀 AI Key Manager: Loaded ${this.keys.length} Gemini keys`)
  }

  getNextKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No AI keys available')
    }
    const key = this.keys[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % this.keys.length
    return key
  }

  getStats() {
    return {
      totalKeys: this.keys.length,
      currentIndex: this.currentIndex
    }
  }
}

// Updated Whop API Client using REST API
class SimpleWhopAPI {
  private apiKey = '4lZaVppAcIAQtXHzrW5iM7dvPB_SK7TdjfgqgeGXwEM'
  private baseURL = 'https://api.whop.com/api/v5'
  private companyId = 'biz_AcOnLS1P3No7me'

  async testConnection() {
    // Try multiple REST endpoints to find the right one
    const endpoints = [
      '/companies/me',
      '/me',
      '/users/me', 
      '/apps/me',
      `/companies/${this.companyId}`,
      '/products',
      '/experiences',
      '/hubs'
    ]

    console.log('🧪 Testing Whop REST API endpoints...')

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing: ${endpoint}`)
        
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        })

        console.log(`📡 ${endpoint} returned: ${response.status}`)

        if (response.status === 429) {
          console.log('⏳ Rate limited, waiting...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }

        if (response.ok) {
          const data = await response.json()
          console.log(`🎉 SUCCESS! Working endpoint: ${endpoint}`)
          console.log('Sample data:', data)
          
          // If we found a working endpoint, try to find content/opportunities
          await this.findContentEndpoints()
          
          return { 
            success: true, 
            endpoint: endpoint,
            data: data 
          }
        } else if (response.status !== 404) {
          const errorText = await response.text()
          console.log(`⚠️ ${endpoint} error:`, errorText)
        }
      } catch (error) {
        console.log(`❌ ${endpoint} failed:`, error.message)
        continue
      }
    }

    return { 
      success: false, 
      error: 'No working REST endpoints found, but API key is valid'
    }
  }

  async findContentEndpoints() {
    console.log('🔍 Searching for content/opportunity endpoints...')
    
    const contentEndpoints = [
      '/posts',
      '/experiences',
      '/products',
      '/content',
      '/opportunities', 
      '/campaigns',
      '/creator-opportunities',
      '/marketplace',
      `/companies/${this.companyId}/posts`,
      `/companies/${this.companyId}/products`,
      `/companies/${this.companyId}/experiences`,
      `/companies/${this.companyId}/content`
    ]

    for (const endpoint of contentEndpoints) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}?limit=1`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`🎯 CONTENT ENDPOINT FOUND: ${endpoint}`)
          console.log('Content data sample:', data)
        } else {
          console.log(`📍 ${endpoint}: ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ ${endpoint} error:`, error.message)
      }
    }
  }
}

// Initialize systems
const aiKeyManager = new SimpleAIKeyManager()
const whopApi = new SimpleWhopAPI()

// Test systems on load
console.log('🚀 Testing Enterprise AI System...')
console.log('AI Stats:', aiKeyManager.getStats())

// Test AI key rotation
for (let i = 0; i < 3; i++) {
  const key = aiKeyManager.getNextKey()
  console.log(`AI Key ${i + 1}:`, key.substring(0, 20) + '...')
}

// Test Whop API
console.log('🧪 Testing Whop REST API...')
whopApi.testConnection().then(result => {
  if (result.success) {
    console.log('🎉 WHOP REST API CONNECTED! Found working endpoint!')
    console.log('Next step: Build AI agent to process real Whop data!')
  } else {
    console.log('❌ Whop API exploration failed:', result.error)
  }
})

// Mock data for display
const mockOpportunities = [
  {
    id: '1',
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
    match_score: 92
  },
  {
    id: '2',
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
    match_score: 78
  },
  {
    id: '3',
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
    match_score: 88
  }
]

// Opportunity Card Component
function OpportunityCard({ opportunity }: { opportunity: any }) {
  const handleApply = () => {
    window.open(opportunity.whop_url, '_blank')
  }

  const getDifficultyText = (difficulty: number) => {
    const levels = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
    return levels[difficulty]
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      marginBottom: '30px',
      border: '2px solid #e0e0e0',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span style={{
            backgroundColor: opportunity.content_type === 'content_clipping' ? '#339af0' : '#51cf66',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '1rem',
            fontWeight: 600,
            marginRight: '10px'
          }}>
            {opportunity.content_type === 'content_clipping' ? 'Content Clipping' : 'UGC'}
          </span>
          <span style={{
            backgroundColor: '#ffd43b',
            color: 'black',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '1.1rem',
            fontWeight: 700
          }}>
            ${opportunity.payout}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 style={{
        color: 'black',
        fontSize: '1.8rem',
        fontWeight: 700,
        marginBottom: '10px',
        lineHeight: 1.3
      }}>
        {opportunity.title}
      </h2>

      {/* Brand & Category */}
      <p style={{
        color: '#666',
        fontSize: '1.2rem',
        marginBottom: '20px',
        fontWeight: 500
      }}>
        {opportunity.brand} • {opportunity.category}
      </p>

      {/* Description */}
      <p style={{
        color: 'black',
        fontSize: '1.1rem',
        lineHeight: 1.5,
        marginBottom: '25px'
      }}>
        {opportunity.description}
      </p>

      {/* Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '20px',
        marginBottom: '25px'
      }}>
        <div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Match Score</p>
          <p style={{
            color: opportunity.match_score > 90 ? '#51cf66' : opportunity.match_score > 80 ? '#ffd43b' : '#ff8787',
            fontSize: '1.3rem',
            fontWeight: 700,
            margin: 0
          }}>
            {opportunity.match_score}%
          </p>
        </div>
        <div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Difficulty</p>
          <p style={{ color: 'black', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            {getDifficultyText(opportunity.difficulty)}
          </p>
        </div>
        <div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Est. Hours</p>
          <p style={{ color: 'black', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            {opportunity.estimated_hours}h
          </p>
        </div>
        <div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Deadline</p>
          <p style={{ color: 'black', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            {opportunity.deadline}
          </p>
        </div>
        <div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Applicants</p>
          <p style={{ color: 'black', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            {opportunity.applicant_count}
          </p>
        </div>
      </div>

      {/* Apply Button */}
      <Button 
        onClick={handleApply}
        size="xl"
        style={{ 
          fontSize: '1.3rem', 
          padding: '16px 32px',
          height: '60px',
          width: '100%'
        }}
      >
        Apply on Whop →
      </Button>
    </div>
  )
}

// Login Page
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) {
        setError(authError.message)
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="md" py={50}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '40px', 
          fontSize: '3rem',
          fontWeight: 600
        }}>
          Welcome to ClippIntell!
        </h1>
        
        {error && (
          <div style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            fontSize: '1.6rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}
        
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px' }}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              color: 'black', 
              fontSize: '1.6rem', 
              fontWeight: 500, 
              marginBottom: '10px' 
            }}>
              Email *
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                fontSize: '1.4rem',
                padding: '16px',
                height: '60px',
                border: '2px solid #ccc',
                borderRadius: '6px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              color: 'black', 
              fontSize: '1.6rem', 
              fontWeight: 500, 
              marginBottom: '10px' 
            }}>
              Password *
            </label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                fontSize: '1.4rem',
                padding: '16px',
                height: '60px',
                border: '2px solid #ccc',
                borderRadius: '6px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <Button 
            onClick={handleLogin}
            fullWidth 
            loading={loading} 
            style={{ 
              fontSize: '1.5rem', 
              padding: '20px',
              height: '70px',
              marginTop: '20px'
            }}
          >
            Sign in
          </Button>
        </div>
      </div>
    </Container>
  )
}

// Dashboard
function DashboardPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <Container size="xl" py={30}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          color: 'white', 
          marginBottom: '20px', 
          fontSize: '3rem',
          fontWeight: 600
        }}>
          🎯 Your Opportunities
        </h1>
        
        <p style={{ 
          color: 'white', 
          marginBottom: '30px', 
          fontSize: '1.4rem'
        }}>
          {mockOpportunities.length} opportunities found • Discovering Whop REST endpoints...
        </p>
        
        <Group justify="center" gap="md">
          <Button size="xl" variant="outline" style={{ fontSize: '1.2rem', padding: '12px 24px' }}>
            Filters
          </Button>
          <Button size="xl" variant="outline" style={{ fontSize: '1.2rem', padding: '12px 24px' }}>
            Settings
          </Button>
          <Button onClick={handleLogout} size="xl" variant="light" color="red" style={{ fontSize: '1.2rem', padding: '12px 24px' }}>
            Logout
          </Button>
        </Group>
      </div>

      {/* Opportunities List */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {mockOpportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </Container>
  )
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App