import type { ReactNode } from "react";
import { theme } from "../../styles/theme";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Container } from "./Container";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      background: theme.colors.background
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0
      }}>
        <Header />
        <main style={{
          flex: 1,
          overflow: "auto",
          padding: theme.spacing.lg
        }}>
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  );
}








