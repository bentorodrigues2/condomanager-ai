export default function IntroVideo() {
  return (
    <div className="video-frame">
      <video
        src="/assets/videos/intro.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="video-element"
      />
    </div>
  );
}
