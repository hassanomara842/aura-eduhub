const f = async () => {
  for(let i=0; i<15; i++){
    try {
      const res = await fetch('https://aura-eduhub.vercel.app/api/health');
      const text = await res.text();
      console.log(text);
      if (text.includes('dbState":1')) {
        console.log('CONNECTED!');
        return;
      }
    } catch(e){
      console.log('error', e.message);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
};
f();
