const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9200;
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

    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                // Rewrite for SPA support or just simple 404 for now, but user mentioned redirects.
                // Let's check if it's a directory like /admin or /Redirect
                if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
                    if (!req.url.endsWith('/')) {
                        res.writeHead(301, { 'Location': req.url + '/' });
                        res.end();
                        return;
                    }
                    filePath += 'index.html';
                    fs.readFile(filePath, (err, idxContent) => {
                        if (err) {
                            res.writeHead(404);
                            res.end('404 Not Found (Dir index mismatch)');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(idxContent, 'utf-8');
                        }
                    });
                    return;
                }

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
