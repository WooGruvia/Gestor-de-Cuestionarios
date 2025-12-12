const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./src/app'); 

const PORT = 3443;

const options = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

https.createServer(options, app).listen(PORT, () => {
    console.log(`✅ Servidor Seguro (HTTPS) corriendo en: https://localhost:${PORT}`);
});
