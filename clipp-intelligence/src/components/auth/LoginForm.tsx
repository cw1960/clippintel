import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Alert,
  Stack,
  Group,
  Divider,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconLogin, IconMail, IconLock } from '@tabler/icons-react';
import { useAuth } from '../../stores/authStore';
import type { SignInForm } from '../../types/user';

interface LoginFormProps {
  onSignUp?: () => void;
  onForgotPassword?: () => void;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSignUp,
  onForgotPassword,
  redirectTo = '/dashboard',
}) => {
  const { signIn, loading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignInForm>({
    initialValues: {
      email: '',
      password: '',
      remember_me: false,
    },

    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    },

    validateInputOnBlur: true,
    validateInputOnChange: false,
  });

  const handleSubmit = async (values: SignInForm) => {
    setIsSubmitting(true);
    clearError();

    try {
      const result = await signIn(values.email, values.password);

      if (result.success) {
        notifications.show({
          title: 'Welcome back!',
          message: 'You have been successfully logged in.',
          color: 'green',
          icon: <IconLogin size={16} />,
        });

        // Redirect will be handled by the parent component or router
        if (redirectTo && window.location.pathname !== redirectTo) {
          window.location.href = redirectTo;
        }
      } else {
        notifications.show({
          title: 'Login Failed',
          message: result.error?.message || 'Invalid email or password',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      notifications.show({
        title: 'Login Error',
        message: 'An unexpected error occurred. Please try again.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      notifications.show({
        title: 'Forgot Password',
        message: 'Please contact support to reset your password.',
        color: 'blue',
      });
    }
  };

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ position: 'relative', width: '100%', maxWidth: 400 }}
    >
      <LoadingOverlay
        visible={loading || isSubmitting}
        overlayProps={{ blur: 1 }}
        loaderProps={{ color: 'blue', type: 'oval' }}
      />

      <Title order={2} ta="center" mb="md" c="white">
        Welcome Back
      </Title>

      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Sign in to your ClippIntell account
      </Text>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Authentication Error"
          color="red"
          mb="md"
          variant="filled"
          onClose={clearError}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Email Address"
            placeholder="your@email.com"
            leftSection={<IconMail size={16} />}
            required
            {...form.getInputProps('email')}
            styles={{
              label: { color: 'white' },
              input: {
                backgroundColor: 'var(--mantine-color-dark-7)',
                borderColor: 'var(--mantine-color-dark-4)',
                color: 'white',
                '&:focus': {
                  borderColor: 'var(--mantine-color-blue-5)',
                },
              },
            }}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            leftSection={<IconLock size={16} />}
            required
            {...form.getInputProps('password')}
            styles={{
              label: { color: 'white' },
              input: {
                backgroundColor: 'var(--mantine-color-dark-7)',
                borderColor: 'var(--mantine-color-dark-4)',
                color: 'white',
                '&:focus': {
                  borderColor: 'var(--mantine-color-blue-5)',
                },
              },
              innerInput: {
                backgroundColor: 'transparent',
                color: 'white',
              },
            }}
          />

          <Group justify="space-between" mt="xs">
            <Checkbox
              label="Remember me"
              {...form.getInputProps('remember_me', { type: 'checkbox' })}
              styles={{
                label: { color: 'white' },
              }}
            />
            <Anchor component="button" size="sm" onClick={handleForgotPassword} c="blue">
              Forgot password?
            </Anchor>
          </Group>

          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            leftSection={<IconLogin size={16} />}
            mt="md"
          >
            Sign In
          </Button>
        </Stack>
      </form>

      <Divider my="lg" label="or" labelPosition="center" />

      <Text ta="center" size="sm">
        Don't have an account?{' '}
        <Anchor component="button" onClick={onSignUp} c="blue">
          Sign up
        </Anchor>
      </Text>
    </Paper>
  );
}; 