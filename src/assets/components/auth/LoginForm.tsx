import { useState } from 'react'
import { TextInput, PasswordInput, Button, Paper, Title, Stack, Alert } from '@mantine/core'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }
    
    try {
      await onLogin(email, password)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Title ta="center" mb="md">Welcome back!</Title>
      
      {error && <Alert color="red" mb="md">{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button type="submit" fullWidth loading={loading}>
            Sign in
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}