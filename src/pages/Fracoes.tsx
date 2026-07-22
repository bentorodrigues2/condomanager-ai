import PageGuard from '../middleware/PageGuard';
import React from "react";

export default function Fracoes() { return (<PageGuard role='gestor'>) {
  return (
    <div>
      <h2>Fracoes</h2>
      <p>Página de Fracoes pronta para desenvolvimento.</p>
    </div></PageGuard>)
  );
}

