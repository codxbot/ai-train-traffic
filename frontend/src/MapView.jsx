import React from 'react'


// Simple SVG-based map view. Coordinates are in 0..100 space.
function Node({ x, y, id }) {
return (
<g>
<circle cx={x} cy={y} r={3} fill="#222" />
<text x={x+4} y={y+4} fontSize={6}>{id}</text>
</g>
)
}


function Track({ points }) {
const d = points.map((p,i) => (i===0?`M ${p.x} ${p.y}`:`L ${p.x} ${p.y}`)).join(' ')
return <path d={d} stroke="#555" strokeWidth={1.5} fill="none" />
}


export default function MapView({ state }) {
const { nodes, tracks, trains } = state


// helper: