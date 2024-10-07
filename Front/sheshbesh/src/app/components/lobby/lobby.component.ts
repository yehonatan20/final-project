import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { SocketService } from '../../services/client/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginAuthService } from '../../services/loginAuth/login-auth.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NotifierService } from 'angular-notifier';
 
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  imports: [FormsModule, CommonModule, PickerModule],
  standalone: true
})
export class LobbyComponent implements OnDestroy, OnInit {
  showEmojiPicker = false;
  private messageSubscription: Subscription = new Subscription;
  messages: string[] = [];
  newMessage: string = '';
  username: string = this.loginAuthService.getCurrentUser().username;
  room: string = '';
 
  @ViewChild('textArea') textArea!: ElementRef;
 
  constructor(private socketService: SocketService, private loginAuthService: LoginAuthService, private popup: NotifierService, private cdRef: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.messageSubscription = this.socketService.subscribeToChat().subscribe((data) => {
      this.messages.push(`${data.user} ${this.getFormattedDateTime()}: ${data.msg}`);
      this.cdRef.detectChanges();
      // Scroll to the bottom after the message is sent
      this.scrollToBottom();
    });
    this.socketService.emitSetUsername(this.username);
  }
  
  scrollToBottom(): void {
    try {
      this.textArea.nativeElement.scrollTop = this.textArea.nativeElement.scrollHeight;
    } catch (err) {
      console.log('Scroll failed:', err);
    }
  }

  getFormattedDateTime(): string {
    const now = new Date();

    // Format the date part as dd/mm/yy
    const datePart = now.toLocaleDateString('en-GB', { // 'en-GB' for dd/mm/yyyy format
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    // Format the time part as hh:mm
    const timePart = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // To get the 24-hour format
    });

    return `${datePart} ${timePart}`;
  }

  logout() {
    this.loginAuthService.logout();
    this.popup.notify('info', `${this.username} disconnected`);
  }
 
  joinRoom() {
    if (this.room) {
      this.socketService.joinRoom(this.room);
    }
  }
 
  sendMessage() {
    if (this.newMessage.trim()) {
      this.socketService.emitMessage({ user: this.username || 'Anonymous', msg: this.newMessage });
      this.newMessage = '';
    }
    console.log(this.messages);
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