const https = require('https');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  rejectUnauthorized: false, 
  ALPNProtocols: ['h2', 'http/1.1'] 
};
console.log('🕵️  Verificando protocolo del servidor...');
const req = https.request(options, (res) => {
  const protocolo = res.socket.alpnProtocol;
  console.log('------------------------------------------------');
  if (protocolo === 'h2') {
      console.log('✅ ¡ÉXITO! El servidor está usando: h2 (HTTP/2)');
  } else {
      console.log('⚠️  El servidor está usando: ' + (protocolo || 'http/1.1'));
      console.log('Revisa que index.js tenga "http2-express-bridge".');
  }
  console.log('------------------------------------------------');
});
req.on('error', (e) => {
  console.error('❌ Error conectando:', e.message);
  console.log('CONSEJO: Asegúrate de que "node index.js" esté corriendo en OTRA terminal.');
});
req.end();