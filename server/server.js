'use strict';
/*
  Húp Phở 1v1 server.
  - Serves the game (index.html, the menu photos in dish-pics/, and photos/ if present) over HTTP.
  - Pairs players over a WebSocket at /ws: both get the same dish and hazard seed, see each other's
    bowl drain live, and get a result when both are done.
  - Nobody else waiting after WAIT_MS: the player races a recorded run of an earlier real player
    (a "ghost"), or a house bot when that dish has no recordings yet.
  The server trusts the times clients report; there is no cheat protection in this version.
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.resolve(__dirname, '..');
const RUNS_FILE = process.env.RUNS_FILE || path.join(__dirname, 'runs.json');
const DISH_COUNT = 31;          // must match DISHES.length in index.html
const WAIT_MS = Number(process.env.WAIT_MS) || 6000;
const MAX_MSG = 8192;           // bytes per message
const MAX_RATE = 30;            // messages per second per connection
const RUNS_PER_DISH = 20;
const MAX_SAMPLES = 80;
const EVENTS = new Set(['choke', 'gasp', 'scold', 'treat', 'broke', 'long', 'cay', 'hoc', 'cough', 'hot', 'cool', 'burn']);

/* ---------- static files: the game page, and photos/ ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function sendFile(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': file.endsWith('.html') ? 'no-cache' : 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' });
    res.end(buf);
  });
}

const server = http.createServer((req, res) => {
  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.writeHead(400); res.end(); return; }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
  if (url === '/' || url === '/index.html') return sendFile(res, path.join(ROOT, 'index.html'));
  if (url === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ok'); return; }
  // only photos/ and dish-pics/ are served besides the page; nothing else in the project folder is exposed
  if (/^\/(photos|dish-pics)\/[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(url)) return sendFile(res, path.join(ROOT, url));
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found');
});

/* ---------- recorded runs (ghosts) ---------- */
let runs = {};
try { runs = JSON.parse(fs.readFileSync(RUNS_FILE, 'utf8')) || {}; } catch (e) { runs = {}; }
let saveTimer = null;
function saveRuns() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => fs.writeFile(RUNS_FILE, JSON.stringify(runs), () => {}), 1000);
}
function cleanSamples(s) {
  if (!Array.isArray(s) || s.length < 2 || s.length > MAX_SAMPLES) return null;
  const out = [];
  for (const p of s) {
    if (!Array.isArray(p) || p.length !== 2) return null;
    const t = Number(p[0]), l = Number(p[1]);
    if (!isFinite(t) || !isFinite(l) || t < 0 || t > 600 || l < 0 || l > 1) return null;
    out.push([Math.round(t * 100) / 100, Math.round(l * 1000) / 1000]);
  }
  return out;
}
function recordRun(dish, seed, name, time, samples) {
  const s = cleanSamples(samples);
  if (!s || !(time > 1 && time < 600)) return;
  const list = runs[dish] || (runs[dish] = []);
  list.push({ name, seed, time: Math.round(time * 100) / 100, s });
  if (list.length > RUNS_PER_DISH) list.splice(0, list.length - RUNS_PER_DISH);
  saveRuns();
}

/* ---------- helpers ---------- */
const randSeed = () => crypto.randomInt(1, 2 ** 31 - 1);
const randDish = () => crypto.randomInt(0, DISH_COUNT);
function cleanName(n) {
  const s = String(n == null ? '' : n).replace(/[<>&"'`\\\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
  return s || 'Khách';
}
function send(ws, msg) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(msg)); }
function other(room, ws) { return room.players.find((p) => p !== ws); }

/* ---------- queue and rooms ---------- */
const queue = [];      // sockets waiting for an opponent
const rooms = new Map();

function unqueue(ws) {
  const i = queue.indexOf(ws);
  if (i >= 0) queue.splice(i, 1);
  clearTimeout(ws.waitTimer); ws.waitTimer = null;
}

function startRoom(a, b) {
  const room = { id: crypto.randomUUID(), players: [a, b], seed: randSeed(), dish: randDish(), ready: new Set(), done: new Map(), rematch: new Set(), started: false };
  rooms.set(room.id, room);
  for (const ws of room.players) {
    ws.room = room; ws.solo = null;
    send(ws, { type: 'match', room: room.id, seed: room.seed, dish: room.dish, opp: { name: other(room, ws).name } });
  }
}

function leaveRoom(ws, notify) {
  const room = ws.room;
  if (!room) return;
  ws.room = null;
  const opp = other(room, ws);
  room.players = room.players.filter((p) => p !== ws);
  if (opp && notify) {
    send(opp, { type: 'left' });
    // the one left behind wins by forfeit if they were still racing
    if (room.done.has(opp)) send(opp, { type: 'result', you: room.done.get(opp), opp: null, forfeit: true });
  }
  if (room.players.length === 0) rooms.delete(room.id);
}

function find(ws, name) {
  ws.name = cleanName(name);
  leaveRoom(ws, true); unqueue(ws); ws.solo = null;
  const opp = queue.find((p) => p !== ws && p.readyState === 1);
  if (opp) { unqueue(opp); startRoom(opp, ws); return; }
  queue.push(ws);
  send(ws, { type: 'searching' });
  ws.waitTimer = setTimeout(() => {
    if (queue.indexOf(ws) < 0 || ws.readyState !== 1) return;
    unqueue(ws);
    const dish = randDish();
    const list = runs[dish] || [];
    if (list.length) {
      const run = list[crypto.randomInt(0, list.length)];
      ws.solo = { dish, seed: run.seed };
      send(ws, { type: 'ghost', dish, seed: run.seed, run: { name: run.name, time: run.time, s: run.s } });
    } else {
      const seed = randSeed();
      ws.solo = { dish, seed };
      send(ws, { type: 'bot', dish, seed });
    }
  }, WAIT_MS);
}

function onMessage(ws, msg) {
  const room = ws.room;
  switch (msg.type) {
    case 'find': return find(ws, msg.name);
    case 'cancel': unqueue(ws); leaveRoom(ws, true); ws.solo = null; return;
    case 'ready': {
      if (!room || room.started) return;
      room.ready.add(ws);
      const opp = other(room, ws);
      if (opp) send(opp, { type: 'oppready' });
      if (room.ready.size === 2) {
        room.started = true;
        for (const p of room.players) send(p, { type: 'go', in: 3000 });
      }
      return;
    }
    case 'p': {
      if (!room || !room.started) return;
      const lvl = Number(msg.lvl), at = Number(msg.at);
      if (!isFinite(lvl) || !isFinite(at)) return;
      const out = { type: 'p', lvl: Math.max(0, Math.min(1, lvl)), at: Math.max(0, Math.min(600, at)) };
      if (EVENTS.has(msg.e)) out.e = msg.e;
      send(other(room, ws), out);
      return;
    }
    case 'done': {
      const time = Number(msg.time);
      if (!(time > 0 && time < 600)) return;
      if (room) {
        if (room.done.has(ws)) return;
        room.done.set(ws, time);
        recordRun(room.dish, room.seed, ws.name, time, msg.samples);
        const opp = other(room, ws);
        if (!opp) { send(ws, { type: 'result', you: time, opp: null, forfeit: true }); return; }
        send(opp, { type: 'oppdone', time });
        if (room.done.has(opp)) {
          send(ws, { type: 'result', you: time, opp: room.done.get(opp) });
          send(opp, { type: 'result', you: room.done.get(opp), opp: time });
        }
      } else if (ws.solo) {
        recordRun(ws.solo.dish, ws.solo.seed, ws.name, time, msg.samples);
        ws.solo = null;
      }
      return;
    }
    case 'rematch': {
      if (!room) return;
      const opp = other(room, ws);
      if (!opp) { send(ws, { type: 'left' }); return; }
      room.rematch.add(ws);
      if (room.rematch.size === 2) {
        rooms.delete(room.id);
        startRoom(room.players[0], room.players[1]);
      } else send(opp, { type: 'rematchasked' });
      return;
    }
    default: return;
  }
}

/* ---------- sockets ---------- */
const wss = new WebSocketServer({ server, path: '/ws', maxPayload: MAX_MSG });
wss.on('connection', (ws) => {
  ws.alive = true; ws.name = 'Khách'; ws.room = null; ws.solo = null;
  ws.rate = { second: 0, count: 0 };
  ws.on('pong', () => { ws.alive = true; });
  ws.on('message', (data) => {
    const now = Math.floor(Date.now() / 1000);
    if (ws.rate.second !== now) { ws.rate.second = now; ws.rate.count = 0; }
    if (++ws.rate.count > MAX_RATE) return;
    let msg;
    try { msg = JSON.parse(data); } catch (e) { return; }
    if (!msg || typeof msg.type !== 'string') return;
    onMessage(ws, msg);
  });
  ws.on('close', () => { unqueue(ws); leaveRoom(ws, true); });
  send(ws, { type: 'hello' });
});
// drop connections that stopped answering
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.alive) { ws.terminate(); continue; }
    ws.alive = false; ws.ping();
  }
}, 30000).unref();

server.listen(PORT, () => console.log(`Húp Phở server on http://localhost:${PORT}`));
