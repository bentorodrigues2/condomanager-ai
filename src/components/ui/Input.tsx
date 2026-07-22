import React from "react";

export default function Input({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          fontSize: "15px"
        }}
      />
    </div>
  );
}





