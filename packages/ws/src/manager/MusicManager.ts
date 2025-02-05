import {redisService} from '../redis'
import { WebSocket } from 'ws';
import {v4 as uuidv4} from 'uuid'
import { validateMusicMessage } from '../helper/MusicHelper';

interface MusicSession {
    sessionId: string;
    trackId: string;
    clients: Set<WebSocket>;
    currentState: {
        isPlaying: boolean;
        currentTime: number;
        bpm: number;
    };
    activeNotes: Map<string, NoteEvent>; // Keep track of currently playing notes
}

interface NoteEvent {
    pitch: number;
    velocity: number;
    timestamp: number;
    instrumentId: string;
}

export class MusicManager {
    private sessions: Map<string, MusicSession>

    constructor() {
        this.sessions = new Map()
        this.initializeRedisSubscriptions()
    }

    private async initializeRedisSubscriptions(): Promise<void> {
        await redisService.subscribe('track', (m: any) => {
            this.handleRedisMessage(JSON.parse(m))
        })
    }

    private async handleRedisMessage(e: any): Promise<void> {
        const session = this.sessions.get(e.sessionId);

        if(!session) return;
        
        switch(e.type) {
            case 'play':
                this.broadCastMessage(session, e);
        }
    }

    private broadCastMessage(session: MusicSession, msg: any, ws?: WebSocket): void {
        session.clients.forEach((client: any) => {
            if(client !== ws && client.readyState !== WebSocket.OPEN) {
                client.send(JSON.stringify(msg))
            }
        })
    }

    async joinRoom(sessionId: string, ws: WebSocket): Promise<void> {
        const session = this.sessions.get(sessionId);

        if (!session) {
            ws.send(JSON.stringify({ type: "error", message: "Session not found" }));
            return;
        }
    

        const clientId = uuidv4()
        // (ws as any).clientId = clientId

        session.clients.add(ws);

        await redisService.addActiveUser(sessionId, ws.id);

        // alert all users in room
        ws.send(JSON.stringify({
            type: "init",
            state: session.currentState,
            activeNotes: Array.from(session.activeNotes.values())
        }));
    
        // Broadcast to other users that someone joined
        this.broadCastMessage(session, {
            type: "user_joined",
            message: "New user joined the session",
            userId: clientId,
            timestamp: Date.now()
        }, ws);
    
        // Set up message handler
        ws.on('message', (data: any) => this.handleMessage(sessionId, ws, data));
        ws.on('close', () => this.leaveRoom(sessionId, ws))


    }

    async leaveRoom(sessionId: string, ws: WebSocket): Promise<void> {
        const session = this.sessions.get(sessionId);

        if(!session) {
            ws.send(JSON.stringify("No sessionId found"))
            return;
        }

        session.clients.delete(ws);

        await redisService.removeActiveUser(sessionId, ws.id)

        session.clients.forEach((client: WebSocket) => {
            if(client.readyState !== WebSocket.OPEN && client !== ws) {
                client.send(JSON.stringify(`${ws.id} left the room`))
            }
        })

        return;
    }

    async handleMessage(sessionId: any, ws: WebSocket, data: any): Promise<void> {
        const session = this.sessions.get(sessionId);

        if(!session) {
            ws.send(JSON.stringify("sessionId not found"))
            return;
        }
        const validate = validateMusicMessage(data);
        
        if(!validate.isValid) {
            ws.send(JSON.stringify({
                type: 'error',
                message: validate.error
            }));
            return;
        }
        const message = validate.message
        try {
            switch(message?.type) {
                case 'cursor':
                    session.clients.forEach((client: WebSocket) => {
                        if(client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: "cursor",
                                position: message.position,
                                timestamp: message.timestamp
                            }));
                        }
                    });
                    break;
                case 'track':
                    const musicId = message.trackId;
                    session.clients.forEach((client: WebSocket) => {
                        if(client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'track',
                                trackId: musicId,
                                timestamp: message.timestamp
                            }))
                        }
                    })
                    break;
                case 'error':
                    session.clients.forEach((ws: WebSocket) => {
                        ws.send(JSON.stringify("Message error: Message not delivered properly"))
                    })
                    break;
                default:
                    console.log('default case in switch case')
            }
        } catch(e) {
            console.log(e)
        }
    }
    

}