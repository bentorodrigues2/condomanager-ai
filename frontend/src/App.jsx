import { useState } from "react";
import VideoFrame from "./components/VideoFrame";
import "./components/VideoFrame.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="app-container">
      {!loggedIn && <VideoFrame />}

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
