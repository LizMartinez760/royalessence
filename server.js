const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const port = process.env.PORT || 5500;
const publicDir = path.resolve(__dirname);

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function getLocalAddresses() {
  const nets = os.networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }

  return results;
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Archivo no encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error del servidor');
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  let requestedPath = decodeURIComponent(req.url.split('?')[0]);
  if (requestedPath === '/') {
    requestedPath = '/INDEX.HTML';
  }

  const filePath = path.join(publicDir, requestedPath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Acceso prohibido');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        serveFile(path.join(publicDir, 'INDEX.HTML'), res);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error del servidor');
      }
      return;
    }

    if (stats.isDirectory()) {
      serveFile(path.join(filePath, 'INDEX.HTML'), res);
    } else {
      serveFile(filePath, res);
    }
  });
});

server.listen(port, () => {
  const localAddresses = getLocalAddresses();
  console.log(`Servidor iniciado en http://localhost:${port}`);
  localAddresses.forEach(address => {
    console.log(`Abre en tu móvil: http://${address}:${port}/INDEX.HTML`);
  });
  if (localAddresses.length === 0) {
    console.log('No se encontró una dirección de red local. Asegúrate de estar conectado a una misma red Wi-Fi.');
  }
});
