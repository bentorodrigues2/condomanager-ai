import fs from "fs";
import path from "path";

const base = path.resolve("src");

// Garantir pastas
const componentsDir = path.join(base, "components");
const scriptsDir = path.join(base, "scripts");

if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir);
if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir);

// Criar Login.css
const loginCSS = `
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  color: white;
  font-family: Arial, sans-serif;
}

.login-box {
  width: 320px;
  padding: 25px;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.15);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 20px;
}

.login-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #00ff88;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.biometria-btn {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #333;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
`;

fs.writeFileSync(path.join(componentsDir, "Login.css"), loginCSS);


// Criar Login.jsx
const loginComponent = `
import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email e password são obrigatórios.");
      return;
    }

    localStorage.setItem("session", "active");
    window.location.href = "/dashboard";
  };

  const ativarBiometria = () => {
    localStorage.setItem("biometria", "ativa");
    alert("Biometria ativada!");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Área Pessoal</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="login-btn" type="submit">
            Entrar
          </button>
        </form>

        <button className="biometria-btn" onClick={ativarBiometria}>
          Ativar Biometria
        </button>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(componentsDir, "Login.jsx"), loginComponent);


// Atualizar App.jsx com rota /login
const appPath = path.join(base, "App.jsx");
let appContent = fs.readFileSync(appPath, "utf8");

if (!appContent.includes("/login")) {
  appContent = appContent.replace(
    "</Routes>",
    `
      <Route path="/login" element={<Login />} />
    </Routes>`
  );

  appContent = `import Login from "./components/Login";\n` + appContent;

  fs.writeFileSync(appPath, appContent);
}

console.log("Login criado com sucesso (email + password + biometria).");
