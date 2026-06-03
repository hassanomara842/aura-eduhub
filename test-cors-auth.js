const f = async () => {
  const res = await fetch('https://aura-eduhub.vercel.app/api/contacts', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://aura-eduhub.netlify.app',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization,content-type'
    }
  });
  console.log('Status:', res.status);
  console.log('Headers:', res.headers);
};
f();
