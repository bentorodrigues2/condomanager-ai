import { useState } from "react";
import IntroVideo from "./components/IntroVideo";
import "./components/IntroVideo.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="app-container">
      {!loggedIn && <IntroVideo />}

      <div className="content-wrapper">
        {loggedIn ? (
          <Dashboard />
        ) : (
          <LoginForm onLogin={() => setLoggedIn(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
