import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import MapView from './MapView'


const socket = io('http://localhost:4000')


export default function App() {
const [state, setState] = useState(null)


useEffect(() => {
socket.on('init', s => setState(s))
socket.on('state', s => setState(s))
return () => { socket.off('state'); socket.off('init') }
}, [])


return (
<div className="app">
<header>
<h1>AI Train Traffic Management — Demo</h1>
<p>Realtime simulation with AI heuristics (collision / congestion detection)</p>
</header>


<main>
{state ? (
<>
<MapView state={state} />
<aside className="panel">
<h3>AI Suggestions</h3>
{state.ai.suggestions.length === 0 ? <p>No suggestions — all good ✅</p> : (
<ul>
{state.ai.suggestions.map(s => (
<li key={s.id}><strong>{s.urgency.toUpperCase()}</strong>: {s.text}</li>
))}
</ul>
)}


<h3>Detected Issues</h3>
{state.ai.issues.length === 0 ? <p>No issues</p> : (
<ul>
{state.ai.issues.map((i, idx) => (
<li key={idx}>{i.type} {i.node ? `@${i.node}` : ''} {i.trains ? `(${i.trains.join(',')})` : ''}</li>
))}
</ul>
)}


<h4>Time: {state.time}</h4>
</aside>
</>
) : (
<p>Connecting to backend...</p>
)}
</main>


<footer>Built for SIH demo • You can extend the AI module in backend/trains.js</footer>
</div>
)
}