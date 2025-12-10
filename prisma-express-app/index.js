const http2 = require('http2'); 
const fs = require('fs');
const path = require('path');
const express = require('express');
const http2Express = require('http2-express-bridge'); 
const app = http2Express(express);
const miAppVieja = require('./src/app');
app.use('/', miAppVieja);
const options = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert')),
    allowHTTP1: true 
};
const PORT = 3000;
const server = http2.createSecureServer(options, app);

server.listen(PORT, () => {
    console.log(`✅ Servidor HTTP/2 Seguro corriendo en: https://localhost:${PORT}`);
});