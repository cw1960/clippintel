import React from "react";
import { Container, Title } from "@mantine/core";
import { IconDashboard } from "@tabler/icons-react";

export const DashboardPage: React.FC = () => {
  return (
    <Container size="xl" style={{ padding: 40 }}>
      <Title order={1} style={{ color: "white" }}>
        Dashboard Test (Mantine + Tabler)
      </Title>
      <IconDashboard size={48} color="#36A4A0" style={{ marginTop: 24 }} />
      <div style={{ color: "white", marginTop: 32 }}>
        This is static dashboard content.
      </div>
    </Container>
  );
};

export default DashboardPage;
