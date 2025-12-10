const tls = require('tls');

const options = {
    rejectUnauthorized: false, 
    ALPNProtocols: ['h2', 'http/1.1']
};
console.log('📡 Conectando al servidor para ver su protocolo...');
const socket = tls.connect(3000, 'localhost', options, () => {
    const protocolo = socket.alpnProtocol;
    console.log('\n=============================================');
    if (protocolo === 'h2') {
        console.log('✅  ¡PRUEBA SUPERADA! ');
        console.log('🚀  Protocolo Negociado: h2 (HTTP/2)');
    } else {
        console.log('⚠️  Protocolo: ' + (protocolo || 'http/1.1'));
        console.log('❌  Aún no es HTTP/2');
    }
    console.log('=============================================\n');
    
    socket.end();
});

socket.on('error', (err) => {
    console.log('❌ Error: El servidor no responde. ¿Está prendido?');
});