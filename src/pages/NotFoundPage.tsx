import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Center,
  Stack,
  Box,
  rem,
} from "@mantine/core";
import {
  IconHome,
  IconArrowLeft,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container size="md" style={{ height: "100vh" }}>
      <Center style={{ height: "100%" }}>
        <Stack align="center" gap="xl">
          {/* Error Icon */}
          <Box
            style={{
              width: rem(120),
              height: rem(120),
              borderRadius: "50%",
              backgroundColor: "var(--mantine-color-blue-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--mantine-color-blue-outline)",
            }}
          >
            <IconExclamationCircle
              size={60}
              color="var(--mantine-color-blue-filled)"
            />
          </Box>

          {/* Error Code */}
          <Title
            order={1}
            style={{
              fontSize: rem(120),
              fontWeight: 900,
              lineHeight: 1,
              color: "var(--mantine-color-blue-6)",
            }}
          >
            404
          </Title>

          {/* Error Message */}
          <Stack align="center" gap="md">
            <Title order={2} ta="center" c="dimmed">
              Oops! Page not found
            </Title>
            <Text c="dimmed" size="lg" ta="center" maw={500}>
              The page you're looking for doesn't exist or has been moved. It
              might have been deleted, renamed, or you entered the wrong URL.
            </Text>
          </Stack>

          {/* Action Buttons */}
          <Group gap="md" mt="xl">
            <Button
              variant="filled"
              size="md"
              leftSection={<IconHome size={18} />}
              onClick={handleGoHome}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              size="md"
              leftSection={<IconArrowLeft size={18} />}
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          </Group>

          {/* Additional Help */}
          <Box mt="xl">
            <Text size="sm" c="dimmed" ta="center">
              Need help? Visit our{" "}
              <Text
                component="a"
                href="/help"
                style={{
                  color: "var(--mantine-color-blue-6)",
                  textDecoration: "underline",
                }}
              >
                help center
              </Text>{" "}
              or{" "}
              <Text
                component="a"
                href="/contact"
                style={{
                  color: "var(--mantine-color-blue-6)",
                  textDecoration: "underline",
                }}
              >
                contact support
              </Text>
            </Text>
          </Box>
        </Stack>
      </Center>
    </Container>
  );
};

export default NotFoundPage;
