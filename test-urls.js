const f = async () => {
  const h = await fetch('https://aura-eduhub.netlify.app');
  const ht = await h.text();
  const m = ht.match(/src="(\/assets\/index-[^"]+)"/);
  if (m) {
    const js = await fetch('https://aura-eduhub.netlify.app' + m[1]);
    const jst = await js.text();
    const matches = jst.match(/https:\/\/[^"']+/g) || [];
    console.log([...new Set(matches)]);
  }
};
f();
