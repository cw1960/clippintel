import {
  AppShell as MantineAppShell,
  Burger,
  useMatches,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { useNavbarState } from "../../stores/layoutStore";
import type { AppShellProps } from "../../types/layout";

export const AppShell: React.FC<AppShellProps> = ({
  children,
  navbar = {
    width: { base: 280, sm: 300, lg: 320 },
    breakpoint: "sm",
  },
  header = {
    height: { base: 60, sm: 70 },
  },
  padding = "md",
}) => {
  const { opened, toggle, close } = useNavbarState();
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure();

  const isMobile = useMatches({
    base: true,
    sm: false,
  });

  // Use mobile disclosure for mobile, store state for desktop
  const navbarOpened = isMobile ? mobileOpened : opened;
  const toggleNavbar = isMobile ? toggleMobile : toggle;
  const closeNavbar = isMobile ? closeMobile : close;

  return (
    <MantineAppShell
      header={{ height: isMobile ? header.height.base : header.height.sm }}
      navbar={{
        width: navbar.width.base,
        breakpoint: navbar.breakpoint,
        collapsed: { mobile: !navbarOpened, desktop: !navbarOpened },
      }}
      padding={padding}
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      {/* Header */}
      <MantineAppShell.Header
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
          backgroundColor: "var(--mantine-color-body)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Header
          burger={
            <Burger
              opened={navbarOpened}
              onClick={toggleNavbar}
              size="sm"
              aria-label="Toggle navigation"
            />
          }
          title="ClippIntell"
          showNotifications={true}
          showUserMenu={true}
          showThemeToggle={true}
        />
      </MantineAppShell.Header>

      {/* Navbar */}
      <MantineAppShell.Navbar
        style={{
          backgroundColor: "var(--mantine-color-body)",
          borderRight: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Navbar opened={navbarOpened} onClose={closeNavbar} />
      </MantineAppShell.Navbar>

      {/* Main Content */}
      <MantineAppShell.Main
        style={{
          backgroundColor: "var(--mantine-color-default-color)",
          minHeight: "calc(100vh - var(--app-shell-header-height))",
          paddingTop: "var(--mantine-spacing-md)",
          paddingBottom: "var(--mantine-spacing-md)",
        }}
      >
        <Box
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 var(--mantine-spacing-md)",
          }}
        >
          {children}
        </Box>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
};
