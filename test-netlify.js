const f = async () => {
  const h = await fetch('https://aura-eduhub.netlify.app');
  const ht = await h.text();
  const m = ht.match(/src="(\/assets\/index-[^"]+)"/);
  if (m) {
    const js = await fetch('https://aura-eduhub.netlify.app' + m[1]);
    const jst = await js.text();
    console.log(jst.includes('aura-eduhub.vercel.app') ? 'USING VERCEL' : 'NOT VERCEL');
    console.log(jst.includes('replit.app') ? 'USING REPLIT' : 'NOT REPLIT');
  } else {
    console.log('No js bundle found');
  }
};
f();
