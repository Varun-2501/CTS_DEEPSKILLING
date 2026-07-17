import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dbPath = join(process.cwd(), 'db.json');

async function readDb() {
  return JSON.parse(await readFile(dbPath, 'utf8'));
}

async function writeDb(db) {
  await writeFile(dbPath, JSON.stringify(db, null, 2) + '\n');
}

function send(res, status, body) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type, authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data ? JSON.parse(data) : {}));
  });
}

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    send(res, 204, {});
    return;
  }

  const url = new URL(req.url ?? '/', 'http://localhost:3000');
  const segments = url.pathname.split('/').filter(Boolean);
  const collection = segments[0];
  const id = Number(segments[1]);
  const db = await readDb();

  if (!collection || !Array.isArray(db[collection])) {
    send(res, 404, { message: 'Not found' });
    return;
  }

  if (req.method === 'GET') {
    let rows = db[collection];
    for (const [key, value] of url.searchParams.entries()) {
      rows = rows.filter((row) => String(row[key]) === value);
    }
    send(res, 200, Number.isFinite(id) ? rows.find((row) => row.id === id) : rows);
    return;
  }

  if (req.method === 'POST') {
    const body = await parseBody(req);
    const rows = db[collection];
    const next = { id: rows.length ? Math.max(...rows.map((row) => Number(row.id) || 0)) + 1 : 1, ...body };
    rows.push(next);
    await writeDb(db);
    send(res, 201, next);
    return;
  }

  if (req.method === 'PUT' && Number.isFinite(id)) {
    const body = await parseBody(req);
    const index = db[collection].findIndex((row) => row.id === id);
    if (index === -1) {
      send(res, 404, { message: 'Not found' });
      return;
    }
    db[collection][index] = { ...body, id };
    await writeDb(db);
    send(res, 200, db[collection][index]);
    return;
  }

  if (req.method === 'DELETE' && Number.isFinite(id)) {
    db[collection] = db[collection].filter((row) => row.id !== id);
    await writeDb(db);
    send(res, 200, {});
    return;
  }

  send(res, 405, { message: 'Method not allowed' });
}).listen(3000, () => {
  console.log('Mock API running at http://localhost:3000');
});
