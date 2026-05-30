import React, { useEffect } from 'react';

export default function AdBanner({ slotId, format = 'auto', style = {} }) {
  useEffect(() => {
    try {
      // Initialize the ad only if it hasn't been initialized yet
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
         window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  // Default styling for unobtrusive ad
  const defaultStyle = {
    display: 'block',
    textAlign: 'center',
    margin: '2rem auto', // Spaced nicely
    padding: '0',
    backgroundColor: 'transparent',
    maxWidth: '100%',
    overflow: 'hidden',
    ...style
  };

  return (
    <div style={{ opacity: 0.9 }}> {/* Slight opacity to blend with design */}
      <ins
        className="adsbygoogle"
        style={defaultStyle}
        data-ad-client="ca-pub-2625644838224246"
        data-ad-slot={slotId || "fallback-slot"} // Leave empty if auto-ads take over, or provide specific slot
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
