import React, { useRef, useEffect, useState } from 'react';
import bgVideo from '../assets/background.mp4';

const VideoBackground = React.memo(({ overlayOpacity = 0.55 }) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <>
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -10,
            pointerEvents: 'none',
          }}
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      ) : (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a0f1e 100%)',
            zIndex: -10,
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `rgba(0,0,0,${overlayOpacity})`,
          zIndex: -9,
          pointerEvents: 'none',
        }}
      />
    </>
  );
});

export default VideoBackground;
