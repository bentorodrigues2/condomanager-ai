import React from "react";

export default function Card({ children }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}
    >
      {children}
    </div>
  );
}





