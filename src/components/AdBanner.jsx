import React, { useEffect, useRef } from 'react';

export default function AdBanner({ adKey = 'c080964d81a0edd40cedecfc50dcf9cd', width = 728, height = 90, style = {} }) {
  const bannerRef = useRef(null);

  useEffect(() => {
    // Prevent duplicate injections
    if (bannerRef.current && !bannerRef.current.hasChildNodes()) {
      if (!adKey) return; // Wait until an adKey is provided

      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = \`//www.highperformanceformat.com/\${adKey}/invoke.js\`;
      
      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(invokeScript);
    }
  }, [adKey, width, height]);

  // Default styling for unobtrusive ad
  const defaultStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '2rem auto', // Spaced nicely
    padding: '0',
    backgroundColor: 'transparent',
    maxWidth: '100%',
    overflow: 'hidden',
    ...style
  };

  if (!adKey) {
    return (
      <div style={defaultStyle}>
        <div style={{ padding: '2rem', border: '1px dashed var(--border-color)', color: 'var(--text-muted)', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          مكان إعلان Adsterra (الرجاء إضافة كود الإعلان)
        </div>
      </div>
    );
  }

  return (
    <div style={{ opacity: 0.9 }}> {/* Slight opacity to blend with design */}
      <div ref={bannerRef} style={defaultStyle}></div>
    </div>
  );
}
