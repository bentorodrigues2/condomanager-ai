import React from "react";

export default function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: "#1e293b",
        color: "white",
        padding: "10px 18px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "500"
      }}
    >
      {children}
    </button>
  );
}





