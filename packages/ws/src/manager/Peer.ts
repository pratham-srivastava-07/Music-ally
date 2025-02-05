import { WebSocket } from "ws";


 export class Peer {
    public peerId: string
    public socket: WebSocket

    constructor(peerId: string, socket: WebSocket) {
        this.peerId = peerId
        this.socket = socket
    }
}