const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'sovereignx-core', 'system', 'database.json');

// ═══════════════════════════════════════
//  Database Functions
// ═══════════════════════════════════════
function readDB() {
   try {
       if (!fs.existsSync(DB_PATH)) {
           fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
           fs.writeFileSync(DB_PATH, JSON.stringify({
               users: {},
               rooms: {},
               stats: { totalGames: 0, totalPlayers: 0 },
               created: new Date().toISOString()
           }, null, 2));
       }
       return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
   } catch (e) {
       console.error('DB Read Error:', e);
       return { users: {}, rooms: {}, stats: { totalGames: 0, totalPlayers: 0 } };
   }
}

function writeDB(data) {
   try {
       fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
       fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
   } catch (e) {
       console.error('DB Write Error:', e);
   }
}

function updateUser(userId, data) {
   const db = readDB();
   if (!db.users[userId]) {
       db.users[userId] = { id: userId, joined: new Date().toISOString(), games: 0, wins: 0 };
   }
   Object.assign(db.users[userId], data);
   writeDB(db);
}

function updateStats(gameType) {
   const db = readDB();
   db.stats.totalGames = (db.stats.totalGames || 0) + 1;
   if (!db.stats[gameType]) db.stats[gameType] = 0;
   db.stats[gameType]++;
   writeDB(db);
}

// ═══════════════════════════════════════
//  HTTP Server (serve HTML)
// ═══════════════════════════════════════
const server = http.createServer((req, res) => {
   const filePath = req.url === '/' 
       ? path.join(__dirname, 'sovereignx-core', 'wep.html')
       : path.join(__dirname, req.url);

   const ext = path.extname(filePath).toLowerCase();
   const mimeTypes = {
       '.html': 'text/html',
       '.js': 'text/javascript',
       '.css': 'text/css',
       '.json': 'application/json',
       '.png': 'image/png',
       '.jpg': 'image/jpeg',
       '.gif': 'image/gif',
       '.svg': 'image/svg+xml',
       '.ico': 'image/x-icon'
   };

   fs.readFile(filePath, (err, content) => {
       if (err) {
           if (err.code === 'ENOENT') {
               res.writeHead(404, { 'Content-Type': 'text/html' });
               res.end('<h1>404 - Not Found</h1>', 'utf-8');
           } else {
               res.writeHead(500);
               res.end(`Server Error: ${err.code}`);
           }
       } else {
           res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
           res.end(content, 'utf-8');
       }
   });
});

// ═══════════════════════════════════════
//  WebSocket Server (real-time games)
// ═══════════════════════════════════════
const wss = new WebSocketServer({ server });

const activeRooms = new Map();
const clients = new Map();

function generateRoomCode() {
   return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function broadcast(room, message, exclude = null) {
   room.players.forEach(player => {
       if (player !== exclude && player.ws.readyState === 1) {
           player.ws.send(JSON.stringify(message));
       }
   });
}

wss.on('connection', (ws, req) => {
   const clientId = req.headers['sec-websocket-key'] || Date.now().toString();
   clients.set(clientId, { ws, room: null, role: null, game: null });
   
   let currentRoom = null;
   let playerRole = null;
   let gameType = null;

   ws.on('message', (raw) => {
       try {
           const data = JSON.parse(raw);
           const db = readDB();

           switch (data.type) {
               case 'create': {
                   const code = generateRoomCode();
                   currentRoom = code;
                   gameType = data.game;
                   playerRole = data.game === 'xo' ? 'X' : 'white';

                   activeRooms.set(code, {
                       game: data.game,
                       players: [{ ws, role: playerRole, clientId }],
                       board: data.game === 'xo' ? Array(9).fill(null) : null,
                       turn: data.game === 'xo' ? 'X' : 'white',
                       created: new Date().toISOString()
                   });

                   // Save to database
                   db.rooms[code] = {
                       game: data.game,
                       creator: clientId,
                       created: new Date().toISOString(),
                       status: 'waiting'
                   };
                   writeDB(db);

                   ws.send(JSON.stringify({
                       type: 'roomCreated',
                       room: code,
                       game: data.game,
                       role: playerRole
                   }));
                   break;
               }

               case 'join': {
                   const room = activeRooms.get(data.room);
                   if (!room) {
                       ws.send(JSON.stringify({ type: 'error', message: 'الغرفة غير موجودة' }));
                       return;
                   }
                   if (room.players.length >= 2) {
                       ws.send(JSON.stringify({ type: 'error', message: 'الغرفة ممتلئة' }));
                       return;
                   }
                   if (room.game !== data.game) {
                       ws.send(JSON.stringify({ type: 'error', message: 'نوع اللعبة مختلف' }));
                       return;
                   }

                   currentRoom = data.room;
                   gameType = room.game;
                   playerRole = room.game === 'xo' ? 'O' : 'black';

                   room.players.push({ ws, role: playerRole, clientId });

                   // Update database
                   if (db.rooms[data.room]) {
                       db.rooms[data.room].status = 'playing';
                       db.rooms[data.room].started = new Date().toISOString();
                       writeDB(db);
                   }

                   updateStats(room.game);

                   ws.send(JSON.stringify({
                       type: 'joined',
                       room: data.room,
                       game: room.game,
                       role: playerRole
                   }));

                   broadcast(room, { type: 'opponentJoined', game: room.game }, ws);
                   break;
               }

               case 'move': {
                   const room = activeRooms.get(data.room);
                   if (!room) return;

                   if (room.game === 'xo') {
                       room.board[data.index] = data.player;
                       room.turn = data.player === 'X' ? 'O' : 'X';
                       broadcast(room, {
                           type: 'move',
                           game: 'xo',
                           index: data.index,
                           player: data.player
                       });
                   } else {
                       room.turn = room.turn === 'white' ? 'black' : 'white';
                       broadcast(room, {
                           type: 'move',
                           game: 'chess',
                           from: data.from,
                           to: data.to
                       });
                   }
                   break;
               }

               case 'chat': {
                   const room = activeRooms.get(data.room);
                   if (!room) return;
                   broadcast(room, {
                       type: 'chat',
                       game: data.game,
                       sender: playerRole === 'X' || playerRole === 'white' ? 'الأول' : 'الثاني',
                       message: data.message
                   });
                   break;
               }

               case 'reset': {
                   const room = activeRooms.get(data.room);
                   if (!room) return;
                   if (room.game === 'xo') {
                       room.board = Array(9).fill(null);
                       room.turn = 'X';
                   } else {
                       room.turn = 'white';
                   }
                   broadcast(room, { type: 'reset', game: room.game });
                   break;
               }

               case 'win': {
                   updateUser(clientId, { wins: (db.users[clientId]?.wins || 0) + 1 });
                   if (currentRoom && db.rooms[currentRoom]) {
                       db.rooms[currentRoom].status = 'finished';
                       db.rooms[currentRoom].winner = clientId;
                       db.rooms[currentRoom].finished = new Date().toISOString();
                       writeDB(db);
                   }
                   break;
               }
           }
       } catch (e) {
           console.error('WS Error:', e);
       }
   });

   ws.on('close', () => {
       clients.delete(clientId);
       if (currentRoom) {
           const room = activeRooms.get(currentRoom);
           if (room) {
               room.players = room.players.filter(p => p.clientId !== clientId);
               if (room.players.length === 0) {
                   activeRooms.delete(currentRoom);
                   const db = readDB();
                   if (db.rooms[currentRoom]) {
                       db.rooms[currentRoom].status = 'closed';
                       db.rooms[currentRoom].closed = new Date().toISOString();
                       writeDB(db);
                   }
               } else {
                   broadcast(room, { type: 'opponentLeft', game: gameType });
               }
           }
       }
   });
});

server.listen(PORT, () => {
   console.log(`🎮 𝑺𝑶𝑽𝑬𝑹𝑬𝑰𝑮𝑵 𝑿 Arena running on port ${PORT}`);
   console.log(`🌐 http://localhost:${PORT}`);
   console.log(`💾 Database: ${DB_PATH}`);
});
