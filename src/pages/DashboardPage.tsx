import React from "react";
import { Container, Title } from "@mantine/core";
import { IconDashboard } from "@tabler/icons-react";
import { useActiveNavItem } from "../stores/layoutStore";

export const DashboardPage: React.FC = () => {
  const nav = useActiveNavItem(); // Always call hooks at the top level
  const activeItem =
    nav && typeof nav.activeItem === "string" ? nav.activeItem : "dashboard";

  return (
    <Container size="xl" style={{ padding: 40 }}>
      <Title order={1} style={{ color: "white" }}>
        Dashboard Test (Mantine + Tabler + Nav)
      </Title>
      <IconDashboard size={48} color="#36A4A0" style={{ marginTop: 24 }} />
      <div style={{ color: "white", marginTop: 32 }}>
        Active Nav Item: {String(activeItem)}
      </div>
    </Container>
  );
};

export default DashboardPage;
