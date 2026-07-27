import React from "react";
import "./VideoFrame.css";

export default function VideoFrame() {
  return (
    <div className="video-frame">
      <div className="video-wrapper">
        <video
          src="/assets/videos/intro.mp4"
          controls
          loop
          playsInline
        />
      </div>
    </div>
  );
}
