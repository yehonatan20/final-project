import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/client/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginAuthService } from '../../services/loginAuth/login-auth.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
 
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  imports: [FormsModule, CommonModule, PickerModule],
  standalone: true
})
export class LobbyComponent implements OnDestroy {
  showEmojiPicker = false;
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

  logout() {
    
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

  addEmoji(event: any) {
    this.newMessage += event.emoji.native;  // Append the selected emoji to the input text
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
 
  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
}