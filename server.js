const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = 8000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript'
};

const server = http.createServer((req, res) => {
    // Default to serving index.html
    let filePath = req.url === '/' ? './index.html' : '.' + req.url;
    
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

function startServer(port) {
    server.listen(port)
        .on('listening', () => {
            console.log(`Server running at http://localhost:${port}/`);
            console.log('Press Ctrl+C to stop');
        })
        .on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying ${port + 1}...`);
                startServer(port + 1);
            } else {
                console.error(e);
            }
        });
}

startServer(PORT);
