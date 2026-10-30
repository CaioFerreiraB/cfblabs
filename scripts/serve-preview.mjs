import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('dist');
const base = (process.env.BASE_PATH ?? '').replace(/\/$/, '');
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  if (base && pathname !== base && !pathname.startsWith(`${base}/`)) {
    response.writeHead(404).end();
    return;
  }
  const relative = pathname.slice(base.length) || '/';
  let filePath = resolve(root, `.${relative}`);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(filePath)).isDirectory()) filePath = resolve(filePath, 'index.html');
    response.setHeader('Content-Type', mimeTypes[extname(filePath)] ?? 'application/octet-stream');
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4321, '127.0.0.1', () => {
  process.stdout.write(`Preview ready at http://127.0.0.1:4321${base}/\n`);
});
