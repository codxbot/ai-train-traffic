const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createTrains, stepSimulation, getState } = require('./trains');


const app = express();
app.use(cors());


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


const PORT = process.env.PORT || 4000;


// Create simulation
const sim = createTrains();


io.on('connection', (socket) => {
console.log('Client connected', socket.id);
// send initial state
socket.emit('init', getState(sim));
});


// Simulation loop: step every 800ms and broadcast
setInterval(() => {
stepSimulation(sim);
const state = getState(sim);
io.emit('state', state);
}, 800);


app.get('/health', (req, res) => res.json({ ok: true }));


server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));