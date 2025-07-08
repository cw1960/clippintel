import React from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Grid,
  Group,
  Button,
  Badge,
  Progress,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconDashboard,
  IconTargetArrow,
  IconBell,
  IconTrendingUp,
  IconCalendarEvent,
  IconLogout,
} from "@tabler/icons-react";
import { useActiveNavItem } from "../stores/layoutStore";
import { useAuth } from "../components/auth";
import { clearAllZustandStores } from "../utils/formatting";

export const DashboardPage: React.FC = () => {
  return (
    <div style={{ color: "white", fontSize: 32, padding: 40 }}>
      Dashboard Test (with imports)
    </div>
  );
};

export default DashboardPage;
