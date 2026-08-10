
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ modules }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="cards-grid">
        {modules.map((m) => (
          <div key={m.id} className={"card " + m.status} onClick={() => navigate(m.route)}>
            <div className="card-icon">{m.icon}</div>
            <div className="card-title">{m.title}</div>
            <div className="card-status">{m.statusLabel}</div>
            {m.badge && <div className="card-badge">{m.badge}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
