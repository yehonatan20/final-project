import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { LoginAuthService } from '../loginAuth/login-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private messageSubject = new Subject<any>();
  private moveSubject = new Subject<any>(); // Subject for moves

  constructor() {
    this.socket = io('http://localhost:3000'); // Use dynamic URL

    this.socket.on('chat message', (data: {user: string, msg: string}) => {
      this.messageSubject.next(data);
    });

    // Listen for move events
    this.socket.on('player move', (moveData: any) => {
      this.moveSubject.next(moveData); // Emit the move data
    });

    this.socket.on('connect error', (error) => {
      console.error('Connection Error:', error);
    });
  }

  // emit(event: string, data: any) {
  //   this.socket.emit(event, data);
  // }

  on(event: string) {
    if(event === 'chat message'){
      return this.messageSubject.asObservable();
    }
    else{
      return this.moveSubject.asObservable();
    }
    
  }

  // New method for emitting moves
  emitMove(moveData: any) {
    this.socket.emit('player move', moveData); // Emit a player move event
  }
  emitMessage(messageData: any){
    this.socket.emit('chat message', messageData);
  }
  subscribeToChat(){
    return this.on('chat message');
  }
  joinRoom(room: any){
    this.socket.emit('join room', room);
  }
  joinLobby(room: any){
    this.socket.emit('join lobby', room);
  }
  emitSetUsername(usernameData: string){
    this.socket.emit('set username', usernameData);
  }

}
