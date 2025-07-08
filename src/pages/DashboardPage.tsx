import React from "react";
import { Container, Title, Text, Stack } from "@mantine/core";

export const DashboardPage: React.FC = () => {
  // TEMP: Remove all useEffect and state logic to prevent infinite loop
  return (
    <Container size="xl">
      <Stack gap="xl">
        <Title order={1}>Dashboard</Title>
        <Text>
          This is a static dashboard test. If you see this, the infinite loop is
          fixed.
        </Text>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
