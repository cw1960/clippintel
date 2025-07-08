import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./App";

const theme = createTheme({
  primaryColor: "orange",
  colors: {
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
  },
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
