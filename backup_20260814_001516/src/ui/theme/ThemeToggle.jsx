
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [mode, setMode] = useState("light");

    useEffect(() => {
        document.body.className = mode;
    }, [mode]);

    return (
        <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
            Mudar para {mode === "light" ? "modo escuro" : "modo claro"}
        </button>
    );
}
