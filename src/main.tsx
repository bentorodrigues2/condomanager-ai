import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";

console.log("🚀 main.tsx carregado — a iniciar renderização.");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
