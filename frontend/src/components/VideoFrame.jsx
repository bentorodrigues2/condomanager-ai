import React from "react";
import "./VideoFrame.css";

export default function VideoFrame() {
  return (
    <div className="video-frame">
      <div className="video-wrapper">
        <video
          src="/intro.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
}
