import { useState } from "react";
import IntroVideo from "./components/IntroVideo";
import "./components/IntroVideo.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="app-container">
      {!loggedIn && <IntroVideo />}

      <div className="content-wrapper">
        {loggedIn ? (
          <Dashboard />
        ) : (
          <Login onLogin={() => setLoggedIn(true)} />
        )}
      </div>
    </div>
  );
}
