export function Video({ src }: { src: string }) {
  return (
    <video
      className="h-full w-full object-cover"
      autoPlay
      playsInline
      loop
      muted
      preload="auto"
    >
      <source src={`${src}`} type="video/mp4" />
      {/* <track
          src=""
          kind="subtitles"
          srcLang="en"
          label="English"
        /> */}
      Your browser does not support the video tag.
    </video>
  );
}
