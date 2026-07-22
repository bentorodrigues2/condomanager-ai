import { theme } from "../../styles/theme";

export function Header() {
  return (
    <header style={{
      width: "100%",
      background: theme.colors.header,
      padding: theme.spacing.md,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ margin: 0 }}>CondoManager AI</h1>
    </header>
  );
}








