console.log("Force Vercel redeploy");

import AppRouter from "./router";
import { AuthProvider } from "./auth/AuthContext";
import Layout from "./ui/layout/Layout";

export default function App() {
    return (
      
<div className="video-wrapper">
  <video
    src="/Videos/logo-animation.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="logo-video"
  />
</div>

    
        <AuthProvider>
            <Layout>
                <AppRouter />
            </Layout>
        </AuthProvider>
    );
}
