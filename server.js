const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 9200; // Use environment PORT for App Hosting
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Parse URL to ignore query strings (e.g. ?utm_source=...)
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let filePath = '.' + parsedUrl.pathname;

    if (filePath === './') filePath = './index.html';

    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';



    // Check if it's a directory before trying to read it
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
        if (!parsedUrl.pathname.endsWith('/')) {
            // Redirect to directory with trailing slash, keeping query params
            parsedUrl.pathname += '/';
            res.writeHead(301, { 'Location': parsedUrl.toString() });
            res.end();
            return;
        }
        filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
