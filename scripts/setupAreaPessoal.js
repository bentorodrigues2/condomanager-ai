import fs from "fs";
import path from "path";

const base = path.resolve("frontend/src");

// 1. Criar Login.jsx
const loginComponent = `
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="login-container">
      <h2>Área Pessoal</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Entrar</button>
      </form>

      <button
        className="biometria-btn"
        onClick={() => localStorage.setItem("biometria", "ativa")}
      >
        Ativar login por biometria
      </button>
    </div>
  );
}
`;

fs.writeFileSync(path.join(base, "components", "Login.jsx"), loginComponent);


// 2. Criar Dashboard.jsx
const dashboardComponent = `
export default function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Bem-vindo à Área Pessoal</h2>
      <p>A sua sessão está ativa.</p>
    </div>
  );
}
`;

fs.writeFileSync(path.join(base, "components", "Dashboard.jsx"), dashboardComponent);


// 3. Atualizar App.jsx com rotas
const appPath = path.join(base, "App.jsx");
let appContent = fs.readFileSync(appPath, "utf8");

if (!appContent.includes("/login")) {
  appContent = appContent.replace(
    "</Routes>",
    `
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>`
  );

  appContent = `import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
` + appContent;

  fs.writeFileSync(appPath, appContent);
}


// 4. Atualizar LayoutTop.jsx para ativar botão só após ação
const layoutPath = path.join(base, "components", "LayoutTop.jsx");
let layoutContent = fs.readFileSync(layoutPath, "utf8");

// Adiciona estado de ativação
if (!layoutContent.includes("const [areaAtiva")) {
  layoutContent = layoutContent.replace(
    "export default function",
    `
import { useState } from "react";

export default function`
  );

  layoutContent = layoutContent.replace(
    "return (",
    `
const [areaAtiva, setAreaAtiva] = useState(false);

return (`
  );
}

// Ativar botão quando seleciona Efetuar Movimento
layoutContent = layoutContent.replace(
  /onClick=\{\(\) => .*?\}/,
  `onClick={() => setAreaAtiva(true)}`
);

// Atualizar botão Área Pessoal — sempre visível, só reage depois
layoutContent = layoutContent.replace(
  /window\.location\.href = ".*?";/,
  `if (areaAtiva) window.location.href = "/login";`
);

fs.writeFileSync(layoutPath, layoutContent);


// 5. Mensagem final
console.log("Área Pessoal criada com sucesso (Browser + PWA + Biometria + Botão sempre visível mas condicionado).");
