import React from 'react';

export default function AdBanner({ adKey = 'c080964d81a0edd40cedecfc50dcf9cd', width = 728, height = 90, style = {} }) {
  // Using srcDoc iframe is the safest way to run Adsterra scripts in React
  // because their scripts often use document.write() which fails if injected normally.
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            background: transparent;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `;

  const defaultStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '2rem auto',
    padding: '0',
    backgroundColor: 'transparent',
    maxWidth: '100%',
    overflow: 'hidden',
    ...style
  };

  return (
    <div style={defaultStyle} className="ad-container">
      <iframe
        srcDoc={srcDoc}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        title="Advertisement"
      />
    </div>
  );
}
