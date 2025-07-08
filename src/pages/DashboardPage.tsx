import React from "react";
import { Container, Title } from "@mantine/core";
import { IconDashboard } from "@tabler/icons-react";
import { useActiveNavItem } from "../stores/layoutStore";

export const DashboardPage: React.FC = () => {
  let activeItem = "unknown";
  let selectorError = null;
  try {
    const nav = useActiveNavItem();
    activeItem =
      nav && typeof nav.activeItem === "string" ? nav.activeItem : "undefined";
    // eslint-disable-next-line no-console
    console.log("DashboardPage useActiveNavItem:", nav);
  } catch (err) {
    selectorError = err;
    // eslint-disable-next-line no-console
    console.error("DashboardPage useActiveNavItem error:", err);
  }

  if (selectorError) {
    return (
      <Container size="xl" style={{ padding: 40 }}>
        <Title order={1} style={{ color: "red" }}>
          DashboardPage Selector Error
        </Title>
        <div style={{ color: "white", marginTop: 32 }}>
          Error: {String(selectorError)}
        </div>
      </Container>
    );
  }

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
