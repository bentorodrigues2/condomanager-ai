
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
