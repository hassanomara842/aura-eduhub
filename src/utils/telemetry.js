export function initTelemetry() {
  const allowedDomains = ['aura-eduhub.netlify.app', 'localhost', '127.0.0.1', 'replit.app', 'aura-eduhub--hassanomara842.replit.app'];
  const currentDomain = window.location.hostname;
  
  // To make it slightly less obvious, we obfuscate the variable names before the final build obfuscation
  if (!allowedDomains.includes(currentDomain)) {
    // Report theft to backend silently
    fetch('https://aura-eduhub--hassanomara842.replit.app/api/report-theft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: currentDomain,
        url: window.location.href,
        time: new Date().toISOString()
      })
    }).catch(() => {}); // catch and ignore to stay silent
    
    // Silent crash (white screen)
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    throw new Error('APP_INIT_FAILED');
  }
}
