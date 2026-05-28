const token = '8576767887:AAEcCJ-1tQyrQH25GHb1M-i5A-VIlv0U_gg';
const chatId = '5335960854';

async function test() {
  const message = '🔔 *Test Notification*';
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
test();
