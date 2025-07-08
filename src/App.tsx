import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Button, Container } from '@mantine/core'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://joxzubnkgelzxoyzotbt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveHp1Ym5rZ2VsenhveXpvdGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4Mzg1ODQsImV4cCI6MjA2NzQxNDU4NH0.3oTCzc1g_G7-QCrEkYDgj2US4z2olyd6A7X-jlpcUoI'
)

// Login Page Component
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    console.log('Login attempt:', { email, password })
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
        console.log('Login successful!', data.user?.email)
        navigate('/dashboard') // Navigate to dashboard on success
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

// Dashboard Page Component
function DashboardPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <Container size="xl" py={50}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          color: 'white', 
          marginBottom: '40px', 
          fontSize: '3.5rem',
          fontWeight: 600
        }}>
          🎉 Welcome to ClippIntell Dashboard!
        </h1>
        
        <p style={{ 
          color: 'white', 
          marginBottom: '40px', 
          fontSize: '1.8rem'
        }}>
          You're successfully logged in! This is where your opportunities will appear.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Button 
            size="xl"
            style={{ 
              fontSize: '1.4rem', 
              padding: '16px 32px',
              height: '70px'
            }}
          >
            View Opportunities
          </Button>
          
          <Button 
            variant="outline"
            size="xl"
            style={{ 
              fontSize: '1.4rem', 
              padding: '16px 32px',
              height: '70px'
            }}
          >
            Settings
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="light"
            color="red"
            size="xl"
            style={{ 
              fontSize: '1.4rem', 
              padding: '16px 32px',
              height: '70px'
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </Container>
  )
}

// Main App with Routing
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