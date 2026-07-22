console.log("Force Vercel redeploy");

import AppRouter from "./router";
import { AuthProvider } from "./auth/AuthContext";
import Layout from "./ui/layout/Layout";

export default function App() {
    return (
    
  <video
    src="/assets/videos/logo-animation.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="logo-video"
  />


      
<div className="video-wrapper">
  <video
    src="/assets/video//assets/video/logo-animation.mp4"
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
