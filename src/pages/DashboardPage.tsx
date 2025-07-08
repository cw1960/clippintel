import React from "react";
import { Container, Title } from "@mantine/core";
import { IconDashboard } from "@tabler/icons-react";
let nav: any = null;
let error: any = null;
try {
  // Dynamically require to avoid crash on import if store is broken
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  nav = require("../stores/layoutStore").useActiveNavItem();
} catch (e) {
  error = e;
}

export const DashboardPage: React.FC = () => {
  if (error) {
    return (
      <Container size="xl" style={{ padding: 40 }}>
        <Title order={1} style={{ color: "red" }}>
          Zustand Selector Error
        </Title>
        <div style={{ color: "red", marginTop: 32 }}>{String(error)}</div>
      </Container>
    );
  }
  if (!nav || typeof nav !== "object" || !("activeItem" in nav)) {
    return (
      <Container size="xl" style={{ padding: 40 }}>
        <Title order={1} style={{ color: "orange" }}>
          Zustand Selector Undefined
        </Title>
        <div style={{ color: "orange", marginTop: 32 }}>
          useActiveNavItem returned: {JSON.stringify(nav)}
        </div>
      </Container>
    );
  }
  return (
    <Container size="xl" style={{ padding: 40 }}>
      <Title order={1} style={{ color: "white" }}>
        Dashboard Test (Zustand selector reintroduced)
      </Title>
      <IconDashboard size={48} color="#36A4A0" style={{ marginTop: 24 }} />
      <div style={{ color: "white", marginTop: 32 }}>
        Active Nav Item: {String(nav.activeItem)}
      </div>
    </Container>
  );
};

export default DashboardPage;
