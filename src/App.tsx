import React from "react";
import { Container, Title, Box, rem } from "@mantine/core";

const bgGradient = "linear-gradient(135deg, #23262B 0%, #181A1B 100%)";

export default function App() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: bgGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container size="sm" style={{ textAlign: "center" }}>
        <img
          src={"/src/assets/logo.png"}
          alt="ClippIntell Logo"
          style={{ width: rem(80), height: rem(80), marginBottom: rem(24) }}
        />
        <Title
          order={1}
          style={{ color: "#F1F0F1", fontWeight: 700, marginBottom: rem(12) }}
        >
          ClippIntell
        </Title>
        <Title order={4} style={{ color: "#36A4A0", fontWeight: 400 }}>
          AI-powered Content Opportunity Discovery
        </Title>
      </Container>
    </Box>
  );
}
