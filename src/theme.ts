import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "orange",
  defaultRadius: "md",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  colors: {
    // Custom palette for ClippIntell
    orange: [
      "#FFECE6",
      "#FFD1C2",
      "#FFB399",
      "#FF8A66",
      "#FF6233",
      "#F5422E",
      "#D93B29",
      "#B93223",
      "#99291D",
      "#7A2017",
    ],
    teal: [
      "#E6FAF9",
      "#C2F0EE",
      "#99E5E2",
      "#66D9D5",
      "#33CDC8",
      "#36A4A0",
      "#2E8C89",
      "#267472",
      "#1E5C5B",
      "#164443",
    ],
    white: [
      "#F1F0F1",
      "#F1F0F1",
      "#F1F0F1",
      "#F1F0F1",
      "#F1F0F1",
      "#F1F0F1",
      "#F1F0F1",
      "#F1F0F1",
      "#F1F0F1",
      "#F1F0F1",
    ],
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5c5f66",
      "#373A40",
      "#23262B",
      "#1A1B1E",
      "#181A1B",
      "#141517",
      "#101113",
    ],
    // Add a custom background gradient for the app shell
    background: [
      "#181A1B",
      "#23262B",
      "#23262B",
      "#23262B",
      "#23262B",
      "#23262B",
      "#23262B",
      "#23262B",
      "#23262B",
      "#23262B",
    ],
    blue: [
      "#E3F2FD",
      "#BBDEFB",
      "#90CAF9",
      "#64B5F6",
      "#42A5F5",
      "#1976d2", // Button Blue
      "#1565C0",
      "#0D47A1",
      "#0B3C91",
      "#082567",
    ],
  },
  components: {
    AppShell: {
      styles: {
        main: {
          background: "linear-gradient(135deg, #23262B 0%, #181A1B 100%)",
        },
      },
    },
    Button: {
      defaultProps: {
        fw: 600,
      },
    },
    Card: {
      defaultProps: {
        shadow: "md",
        radius: "md",
      },
    },
    Paper: {
      defaultProps: {
        shadow: "sm",
        radius: "md",
      },
    },
  },
});
