import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private messageSubject = new Subject<any>();
  private moveSubject = new Subject<any>(); // Subject for moves

  constructor() {
    this.socket = io('http://localhost:3000'); // Use dynamic URL

    this.createBoard();

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

  // copy


  GameRunning = false
  username:any
  roomId:any
  currentPlayer = 'X';
  turnCount = 0;
  public board:any = [];
  url:any
  Notouch = true
  GameFinish = false
  winner = false
  loser = false
  users:any
  draw = false
  rooms:any
  waiting = true
  userLeft = false
  searchbox = false
  roomFull = false


  newGame(){
    this.socket.emit('newGame',this.roomId)
  }

  update(){
      this.socket.on('getRooms',(rooms:any)=>{
        console.log(rooms)
        this.rooms = rooms
      })

      this.socket.on('updateBoard',(boardData:any)=>{
        this.Notouch = false
        this.board = boardData
      })

      this.socket.on('start',(status:any)=>{
        for(let i = 0; i<9; i++){
          this.board[i].state = null
        }
        this.currentPlayer = 'X'
        this.turnCount = 0
        this.draw = false
        this.waiting = false
        this.userLeft = false
        this.winner = false
        this.loser = false
        this.GameFinish = false

        if(this.socket.id == status){
          this.Notouch = true
        }
        else {
          this.Notouch = false
        }
      })
      
      this.socket.on('youLose',()=>{
        this.loser = true
        this.GameFinish = true
        this.Notouch = true
      })

      this.socket.on('userLeft',()=>{
        this.userLeft = true
        this.waiting = true
      })

      this.socket.on('noWinner',()=>{
        this.draw = true
        this.GameFinish = true
      })

      this.socket.on('roomFull',()=>{
        this.roomFull = true
      })

      this.socket.on('startNew',()=>{
        this.socket.emit('newGame',this.roomId)
      })

      this.socket.on('chanCurrPlayer',()=>{
        this.currentPlayer = this.currentPlayer == 'X' ? 'O':'X'
      })

    }


  createBoard(){
    for(let i = 0; i<9; i++){
      this.board.push({id:i,state:null})
    }
  }

  changePlayer(box: { id: string | number; }){
    if(this.board[box.id].state == null){
      this.turnCount += 1
      this.Notouch = true;
      this.board[box.id].state = this.currentPlayer
      this.GameFinish = this.checkBoard(this.board)

      if(this.turnCount == 5 && !this.GameFinish){
        this.socket.emit('draw',this.roomId)
      }

      this.socket.emit('clicked',{board:this.board,roomId:this.roomId})

      if(this.GameFinish){
        this.finishGame()
      }
      }
  }

  connect(){
    if(!this.socket){
      // this.socket = io("https://tic-tac-toe-game-dev-hker.1.us-1.fl0.io",{ transports : ['websocket'] })
      this.socket = io("https://tic-tac-toe-game-6hjt.onrender.com",{ transports : ['websocket'] })
    }

    this.update();

  }

  search(){
    this.connect()
    this.socket.emit('search')
    this.searchbox = true
  }

  joinroom(){
    this.url = window.location.href
    this.username = this.url.split('?')[1].split('&')[0].split('=')[1].replace('%20',' ')
    this.roomId = this.url.split('?')[1].split('&')[1].split('=')[1]
    this.connect()
    this.socket.emit('join',this.roomId)
  }

  checkBoard(board:any){
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (const line of winningLines) {
      const value = board[line[0]].state;
      if (value !== null && value === board[line[1]].state && value === board[line[2]].state) {
        return true;
      }
    }

    return false
  }

  finishGame(){
    this.GameFinish = true
    this.winner = true
    this.socket.emit('finishGame',this.roomId)
  }

  leaveRoom(){
    this.socket.emit('leaveRoom',this.roomId)
  }



}
