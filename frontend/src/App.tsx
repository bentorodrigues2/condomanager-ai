
import React from "react";
import { AppRouter } from "./AppRouter";

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1>CondoManager AI</h1>
      <AppRouter />
    </div>
  );
}
