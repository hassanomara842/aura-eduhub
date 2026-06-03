const token = '8576767887:AAEcCJ-ltQyrQH25GHb1M-i5A-VIlv0U_gg'; // replacing 1 with l
const token2 = '8576767887:AAEcCJ-1tQyrQH25GHblM-i5A-VIlv0U_gg'; // replacing 1 with l in second
const token3 = '8576767887:AAEcCJ-ltQyrQH25GHblM-i5A-VIlv0U_gg'; // both
const token4 = '8576767887:AAEcCJ-1tQyrQH25GHb1M-i5A-VIlvOU_gg'; // O instead of 0
const token5 = '8576767887:AAEcCJ-ltQyrQH25GHb1M-i5A-VIlvOU_gg';


async function testToken(t, name) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${t}/getMe`);
    const data = await res.json();
    console.log(name, data.ok);
  } catch (err) {
    console.error("Error with token test:", err);
  }
}

async function run() {
  await testToken('8576767887:AAEcCJ-1tQyrQH25GHb1M-i5A-VIlv0U_gg', 'original');
  await testToken(token, 'token1');
  await testToken(token2, 'token2');
  await testToken(token3, 'token3');
  await testToken(token4, 'token4');
  await testToken(token5, 'token5');
}
run();
