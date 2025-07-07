import React, { useState } from "react";
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
  Divider,
  LoadingOverlay,
  Progress,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconUserPlus,
  IconMail,
  IconLock,
  IconUser,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useAuth } from "../../stores/authStore";
import type { SignUpForm } from "../../types/user";

interface SignupFormProps {
  onSignIn?: () => void;
  redirectTo?: string;
}

// Password strength checking
const getPasswordStrength = (
  password: string,
): { strength: number; label: string; color: string } => {
  let strength = 0;

  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  const strengthPercentage = (strength / 5) * 100;

  if (strengthPercentage < 40)
    return { strength: strengthPercentage, label: "Weak", color: "red" };
  if (strengthPercentage < 70)
    return { strength: strengthPercentage, label: "Fair", color: "yellow" };
  if (strengthPercentage < 90)
    return { strength: strengthPercentage, label: "Good", color: "orange" };
  return { strength: strengthPercentage, label: "Strong", color: "green" };
};

const PasswordRequirement: React.FC<{ meets: boolean; label: string }> = ({
  meets,
  label,
}) => {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}{" "}
      <Box ml={10}>{label}</Box>
    </Text>
  );
};

export const SignupForm: React.FC<SignupFormProps> = ({
  onSignIn,
  redirectTo = "/dashboard",
}) => {
  const { signUp, loading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const form = useForm<SignUpForm>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      terms_accepted: false,
      marketing_consent: false,
    },

    validate: {
      email: (value) => {
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value))
          return "Please enter a valid email address";
        return null;
      },
      full_name: (value) => {
        if (!value) return "Full name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return null;
      },
      password: (value) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])/.test(value))
          return "Password must contain at least one lowercase letter";
        if (!/(?=.*[A-Z])/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/(?=.*[0-9])/.test(value))
          return "Password must contain at least one number";
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return "Please confirm your password";
        if (value !== values.password) return "Passwords do not match";
        return null;
      },
      terms_accepted: (value) => {
        if (!value) return "You must accept the terms of service";
        return null;
      },
    },

    validateInputOnBlur: true,
    validateInputOnChange: false,
  });

  const handleSubmit = async (values: SignUpForm) => {
    setIsSubmitting(true);
    clearError();

    try {
      const result = await signUp(values.email, values.password, {
        full_name: values.full_name,
      });

      if (result.success) {
        notifications.show({
          title: "Account Created!",
          message:
            "Welcome to ClippIntell! Please check your email to verify your account.",
          color: "green",
          icon: <IconUserPlus size={16} />,
          autoClose: 5000,
        });

        // Clear form
        form.reset();

        // Redirect will be handled by the parent component or router
        if (redirectTo && window.location.pathname !== redirectTo) {
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 2000);
        }
      } else {
        notifications.show({
          title: "Signup Failed",
          message:
            result.error?.message ||
            "Unable to create account. Please try again.",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      notifications.show({
        title: "Signup Error",
        message: "An unexpected error occurred. Please try again.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.values.password);

  const passwordRequirements = [
    { re: /.{8,}/, label: "At least 8 characters" },
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Includes lowercase letter" },
    { re: /[A-Z]/, label: "Includes uppercase letter" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
  ];

  const checks = passwordRequirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ position: "relative", width: "100%", maxWidth: 450 }}
    >
      <LoadingOverlay
        visible={loading || isSubmitting}
        overlayProps={{ blur: 1 }}
        loaderProps={{ color: "blue", type: "oval" }}
      />
      <Title order={2} ta="center" mb="md" c="white">
        Create Account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Sign up for a new ClippIntell account
      </Text>
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Signup Error"
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
            label="Full Name"
            placeholder="Your full name"
            leftSection={<IconUser size={16} />}
            required
            {...form.getInputProps("full_name")}
            styles={{
              label: { color: "white" },
              input: {
                backgroundColor: "var(--mantine-color-dark-7)",
                borderColor: "var(--mantine-color-dark-4)",
                color: "white",
                "&:focus": {
                  borderColor: "var(--mantine-color-blue-5)",
                },
              },
            }}
          />
          <TextInput
            label="Email Address"
            placeholder="your@email.com"
            leftSection={<IconMail size={16} />}
            required
            {...form.getInputProps("email")}
            styles={{
              label: { color: "white" },
              input: {
                backgroundColor: "var(--mantine-color-dark-7)",
                borderColor: "var(--mantine-color-dark-4)",
                color: "white",
                "&:focus": {
                  borderColor: "var(--mantine-color-blue-5)",
                },
              },
            }}
          />
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            leftSection={<IconLock size={16} />}
            required
            {...form.getInputProps("password")}
            onFocus={() => setShowPasswordRequirements(true)}
            styles={{
              label: { color: "white" },
              input: {
                backgroundColor: "var(--mantine-color-dark-7)",
                borderColor: "var(--mantine-color-dark-4)",
                color: "white",
                "&:focus": {
                  borderColor: "var(--mantine-color-blue-5)",
                },
              },
              innerInput: {
                backgroundColor: "transparent",
                color: "white",
              },
            }}
          />
          {showPasswordRequirements && (
            <Box mb="sm">
              <Progress
                value={passwordStrength.strength}
                color={passwordStrength.color}
                size="sm"
                mb={4}
              />
              <Text size="xs" c={passwordStrength.color} mb={4}>
                Password strength: {passwordStrength.label}
              </Text>
              <Stack gap={2}>{checks}</Stack>
            </Box>
          )}
          <PasswordInput
            label="Confirm Password"
            placeholder="Repeat your password"
            leftSection={<IconLock size={16} />}
            required
            {...form.getInputProps("confirmPassword")}
            styles={{
              label: { color: "white" },
              input: {
                backgroundColor: "var(--mantine-color-dark-7)",
                borderColor: "var(--mantine-color-dark-4)",
                color: "white",
                "&:focus": {
                  borderColor: "var(--mantine-color-blue-5)",
                },
              },
              innerInput: {
                backgroundColor: "transparent",
                color: "white",
              },
            }}
          />
          <Checkbox
            label="I accept the terms of service"
            {...form.getInputProps("terms_accepted", { type: "checkbox" })}
            required
            styles={{
              label: { color: "white" },
            }}
          />
          <Checkbox
            label="Send me occasional product updates"
            {...form.getInputProps("marketing_consent", { type: "checkbox" })}
            styles={{
              label: { color: "white" },
            }}
          />
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            leftSection={<IconUserPlus size={16} />}
            mt="md"
          >
            Sign Up
          </Button>
        </Stack>
      </form>
      <Divider my="lg" label="or" labelPosition="center" />
      <Text ta="center" size="sm">
        Already have an account?{" "}
        <Anchor component="button" onClick={onSignIn} c="blue">
          Sign in
        </Anchor>
      </Text>
    </Paper>
  );
};

export default SignupForm;
