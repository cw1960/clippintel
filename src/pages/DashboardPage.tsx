import React from "react";
import { Container, Title } from "@mantine/core";

export const DashboardPage: React.FC = () => {
  return (
    <Container size="xl" style={{ padding: 40 }}>
      <Title order={1} style={{ color: "white" }}>
        Dashboard Test (Mantine only)
      </Title>
    </Container>
  );
};

export default DashboardPage;
