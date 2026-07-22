const fs = require('fs');
const path = require('path');

function createFile(filePath, content = "") {
    fs.writeFileSync(filePath, content);
    console.log("Created:", filePath);
}

const src = path.join(__dirname, "src");

// APP.JSX
createFile(path.join(src, "App.jsx"), `
import AppRouter from "./router";
import { AuthProvider } from "./auth/AuthContext";

export default function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}
`);

// MAIN.JSX (Vite default)
createFile(path.join(src, "main.jsx"), `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
`);

console.log("SETUP V3 COMPLETO — podes correr o projeto agora!");
console.log("Corre: npm run dev");
