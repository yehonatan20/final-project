import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotifierModule } from 'angular-notifier'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotifierModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sheshbesh';
}
