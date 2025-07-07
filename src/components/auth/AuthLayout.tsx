import React from "react";
import {
  Container,
  Stack,
  Group,
  Text,
  Title,
  Box,
  Center,
  Divider,
  Grid,
  useMatches,
} from "@mantine/core";
import {
  IconBrain,
  IconTargetArrow,
  IconShieldCheck,
} from "@tabler/icons-react";
import logo from '../../assets/logo.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showFeatures?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = "Clipp Intelligence",
  subtitle = "Intelligent Opportunity Discovery for Whop Content Clippers",
  showFeatures = true,
}) => {
  const isMobile = useMatches({
    base: true,
    sm: false,
  });

  const features = [
    {
      icon: <IconBrain size={24} />, // Optionally replace with a Whop/content icon
      title: "AI-Powered Whop Matching",
      description:
        "Smart algorithms instantly find Whop content reward opportunities that match your criteria.",
    },
    {
      icon: <IconTargetArrow size={24} />,
      title: "Content-Focused Filters",
      description:
        "Advanced filters help you focus on the most profitable and relevant Whop opportunities.",
    },
    {
      icon: <IconShieldCheck size={24} />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security.",
    },
  ];

  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, var(--mantine-color-dark-8) 0%, var(--mantine-color-dark-6) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container size="xl" py="xl">
        <Grid gutter={60} align="center">
          {/* Left Side - Branding and Features */}
          {!isMobile && (
            <Grid.Col span={6}>
              <Stack gap="xl">
                {/* Company Branding */}
                <Box>
                  <Group align="center" gap="md" mb="md">
                    <Box
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #F5422E 0%, #36A4A0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img src="https://i.imgur.com/Bg1YnEg.png" alt="Clipp Intelligence Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    </Box>
                    <Box>
                      <Title order={1} c="white" fw={700}>
                        {title}
                      </Title>
                      <Text c="dimmed" size="lg">
                        {subtitle}
                      </Text>
                    </Box>
                  </Group>

                  <Text c="gray.3" size="lg" lh={1.6}>
                    Discover and track Whop content reward opportunities with intelligent matching. Clipp Intelligence helps content clippers automate finding and filtering the best Whop.com opportunities—never miss a profitable content reward again.
                  </Text>
                </Box>

                {/* Features List */}
                {showFeatures && (
                  <Stack gap="lg">
                    <Divider
                      label={
                        <Text c="dimmed" fw={500}>
                          Why Choose Clipp Intelligence?
                        </Text>
                      }
                      labelPosition="left"
                    />

                    {features.map((feature, index) => (
                      <Group key={index} align="flex-start" gap="md">
                        <Box
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: "var(--mantine-color-blue-9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid var(--mantine-color-blue-7)",
                          }}
                        >
                          <Box c="blue.4">{feature.icon}</Box>
                        </Box>
                        <Box style={{ flex: 1 }}>
                          <Text c="white" fw={600} mb={4}>
                            {feature.title}
                          </Text>
                          <Text c="dimmed" size="sm" lh={1.5}>
                            {feature.description}
                          </Text>
                        </Box>
                      </Group>
                    ))}
                  </Stack>
                )}

                {/* Social Proof / Stats */}
                <Group gap="xl" mt="xl">
                  <Box ta="center">
                    <Text c="blue.4" size="xl" fw={700}>
                      10,000+
                    </Text>
                    <Text c="dimmed" size="sm">
                      Opportunities Tracked
                    </Text>
                  </Box>
                  <Box ta="center">
                    <Text c="blue.4" size="xl" fw={700}>
                      98%
                    </Text>
                    <Text c="dimmed" size="sm">
                      Match Accuracy
                    </Text>
                  </Box>
                  <Box ta="center">
                    <Text c="blue.4" size="xl" fw={700}>
                      24/7
                    </Text>
                    <Text c="dimmed" size="sm">
                      Monitoring
                    </Text>
                  </Box>
                </Group>
              </Stack>
            </Grid.Col>
          )}

          {/* Right Side - Auth Form */}
          <Grid.Col span={isMobile ? 12 : 6}>
            <Center>
              <Box style={{ width: "100%", maxWidth: 450 }}>
                {/* Mobile Branding */}
                {isMobile && (
                  <Box ta="center" mb="xl">
                    <Group justify="center" align="center" gap="md" mb="md">
                      <Box
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-5))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconBrain size={28} color="white" />
                      </Box>
                      <Box>
                        <Title order={2} c="white" fw={700}>
                          {title}
                        </Title>
                        <Text c="dimmed" size="md">
                          {subtitle}
                        </Text>
                      </Box>
                    </Group>
                  </Box>
                )}
                {children}
              </Box>
            </Center>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};
