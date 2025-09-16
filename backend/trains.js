// trains.js
// Simple simulation and heuristic AI for congestion / collision detection.


function createTrains() {
// Define some fixed nodes (stations / junctions) with coordinates (x,y in SVG space 0..100)
const nodes = {
A: { x: 10, y: 30 },
B: { x: 40, y: 10 },
C: { x: 70, y: 20 },
D: { x: 90, y: 50 },
E: { x: 60, y: 70 },
F: { x: 30, y: 70 }
};


// Define tracks as sequences of node keys (simple graph)
const tracks = [
['A','B','C','D'],
['C','E','F','A'],
['B','F']
];


// Create trains with route index and position (t between 0..1 along route)
const trains = [
{ id: 'T1', routeIndex: 0, t: 0.05, speed: 0.004 },
{ id: 'T2', routeIndex: 0, t: 0.5, speed: 0.0035 },
{ id: 'T3', routeIndex: 1, t: 0.2, speed: 0.0038 },
{ id: 'T4', routeIndex: 2, t: 0.6, speed: 0.0025 }
];


return { nodes, tracks, trains, time: 0 };
}


function lerp(a, b, t) {
return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}


function posOnRoute(sim, train) {
const route = sim.tracks[train.routeIndex];
// route is array of nodes, compute which segment
const segCount = route.length - 1;
const segFloat = train.t * segCount;
const seg = Math.floor(Math.min(segFloat, segCount - 1e-6));
const segT = segFloat - seg;
const a = sim.nodes[route[seg]];
const b = sim.nodes[route[seg+1]];
return lerp(a, b, segT);
}


function detectIssues(sim) {
// Simple heuristics: distance-based congestion and collision risk
const issues = [];
const trainsWithPos = sim.trains.map(tr => ({ ...tr, pos: posOnRoute(sim, tr) }));


// collision: two trains within <= 3 units
for (let i = 0; i < trainsWithPos.length; i++) {
for (let j = i+1; j < trainsWithPos.length; j++) {
const a = trainsWithPos[i];
const b = trainsWithPos[j];
const dx = a.pos.x - b.pos.x;
const dy = a.pos.y - b.pos.y;
const dist = Math.sqrt(dx*dx + dy*dy);
if (dist < 3.5) {
issues.push({ type: 'collision_risk', trains: [a.id, b.id], dist: Number(dist.toFixed(2)) });
}
}
}


// congestion: 3+ trains within 12 units region
for (const nodeKey of Object.keys(sim.nodes)) {
module.exports = { createTrains, stepSimulation, getState };