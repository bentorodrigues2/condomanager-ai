import React from "react";

export default function Header() {
  return (
    <header style={{
      background: "var(--bg-darker)",
      color: "var(--text-light)",
      padding: "var(--spacing)",
      fontSize: "22px",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <span>CondoManager AI</span>
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#64748b"
      }}></div>
    </header>
  );
}






