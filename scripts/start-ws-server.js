import { createWSServer } from '../dist/server/wsServer.js';

const PORT = process.env.WS_PORT || 3001;

console.log('Starting WebSocket server...');
console.log(`WebSocket server will run on port: ${PORT}`);
createWSServer(PORT); 