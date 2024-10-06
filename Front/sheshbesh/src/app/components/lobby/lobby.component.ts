import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/client/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginAuthService } from '../../services/loginAuth/login-auth.service';
 
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class LobbyComponent implements OnDestroy {
  flowerLeftClicks = 0;
  flowerRightClicks = 0;
  private messageSubscription: Subscription;
  messages: string[] = [];
  newMessage: string = '';
  username: string = this.loginAuthService.getCurrentUser().username;
  room: string = '';
 
 
  constructor(private socketService: SocketService, private loginAuthService: LoginAuthService) {
    this.messageSubscription = this.socketService.subscribeToChat().subscribe((data) => {
      this.messages.push(`${data.user}: ${data.msg}`);
    });
  }
 
  joinRoom() {
    if (this.room) {
      this.socketService.joinRoom(this.room);
    }
  }
 
  sendMessage() {
    if (this.newMessage) {
      this.socketService.emitMessage({ user: this.username || 'Anonymous', msg: this.newMessage });
      this.newMessage = '';
    }
  }
 
  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
}