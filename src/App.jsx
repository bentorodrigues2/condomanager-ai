import { useEffect } from "react";
import AppRouter from "./router";
import { AuthProvider } from "./auth/AuthContext";
import Layout from "./ui/layout/Layout";

export default function App() {

    useEffect(() => {
        const video = document.querySelector("video");

        if (!video) {
            console.warn("Nenhum <video> encontrado na página.");
            return;
        }

        console.group("Diagnóstico do Vídeo");

        const styles = window.getComputedStyle(video);
        console.log("position:", styles.position);
        console.log("width:", styles.width);
        console.log("height:", styles.height);
        console.log("object-fit:", styles.objectFit);

        if (styles.position === "absolute" || styles.position === "fixed") {
            console.warn("⚠️ O vídeo está com position absolute/fixed → causa fullscreen.");
        }

        if (styles.height.includes("vh")) {
            console.warn("⚠️ O vídeo está com height em vh → causa fullscreen.");
        }

        if (styles.width.includes("vw")) {
            console.warn("⚠️ O vídeo está com width em vw → causa fullscreen.");
        }

        const bodyStyles = window.getComputedStyle(document.body);
        console.log("body overflow:", bodyStyles.overflow);

        if (bodyStyles.overflow === "hidden") {
            console.warn("⚠️ O body tem overflow:hidden → bloqueia scroll.");
        }

        console.log("pointer-events:", styles.pointerEvents);
        if (styles.pointerEvents !== "none") {
            console.warn("⚠️ O vídeo captura eventos → bloqueia cliques/scroll.");
        }

        const parent = video.parentElement;
        const parentStyles = window.getComputedStyle(parent);
        console.log("parent position:", parentStyles.position);

        if (parentStyles.position !== "relative") {
            console.warn("⚠️ O contentor do vídeo não tem position:relative → vídeo escapa.");
        }

        console.groupEnd();
    }, []);

    return (
        <AuthProvider>
            <Layout>
                <AppRouter />
            </Layout>
        </AuthProvider>
    );
}
