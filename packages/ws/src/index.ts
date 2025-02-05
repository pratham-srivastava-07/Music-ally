import { WebSocket, WebSocketServer } from 'ws';
import { CodeManager } from './manager/Manager.js';
import { Request } from 'express';
import authenticateSocket from './auth.js';

const wss = new WebSocketServer({ port: 8080 });

const codeManager = new CodeManager();

wss.on('connection', async (ws: WebSocket, req: Request) => {
    console.log(`New connection from ${req.socket.remoteAddress}`);

    ws.send('Connection established');
    console.log('Client connected successfully');

    ws.on('error', (err) => console.error('WebSocket error:', err));

    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
        console.warn('Client connected without a session ID');
        return;
    }

    console.log(`Session ID: ${sessionId}`);

    // if (await authenticateSocket(req, ws)) {
    //     console.log(`Client authenticated for session: ${sessionId}`);
    //     codeManager.joinRoom(sessionId, ws);
    // } else {
    //     console.warn(`Authentication failed for session: ${sessionId}`);
    //     ws.close();
    // }

    ws.on('close', () => {
        console.log(`Client disconnected from session: ${sessionId}`);
        codeManager.leaveRoom(sessionId, ws);
    });
});
