import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SocketService } from '../../services/client/socket.service';
import { CommonModule } from '@angular/common';
import { SqaureComponent } from '../sqaure/sqaure.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SqaureComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  constructor(public gameService:SocketService,private router:Router){}

  currentPlayer:any

  ngOnInit(): void {
    this.gameService.joinroom()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(!this.gameService.roomFull){
          this.gameService.leaveRoom();
          this.gameService.rooms = []
        }
      }
    });
  }

  goBack(){
    this.gameService.roomFull = false
    this.router.navigate(['/'])
  }
}
