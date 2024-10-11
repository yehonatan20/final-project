import { Component, Input } from '@angular/core';
import { SocketService } from '../../services/client/socket.service';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-sqaure',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './sqaure.component.html',
  styleUrl: './sqaure.component.css'
})
export class SqaureComponent {

  constructor(public gameService:SocketService){}

  @Input() box: any;
}
