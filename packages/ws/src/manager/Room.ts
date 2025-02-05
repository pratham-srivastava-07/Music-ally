import { Peer } from "./Peer"

export class Room {
   public roomId: string;

   public peers: Peer[] = []

   constructor(roomId: string, peer: Peer) {
        this.roomId = roomId
        this.peers.push(peer)
   }

   addNewPeer(peer: Peer) {
        this.peers.push(new Peer(peer.peerId, peer.socket))
   }

   removePeer(peerId: string) {
        this.peers = this.peers.filter((p) => p.peerId !== peerId)
   }
   
    close<T extends { peerId: string }>(
        items: T[],
        peerId: string,
    ){
        items.forEach((item) => {
            if(item.peerId === peerId){
                (item as any).close()
            }
        })
        items = items.filter((item) => item.peerId !== peerId);
        return items
    }

}