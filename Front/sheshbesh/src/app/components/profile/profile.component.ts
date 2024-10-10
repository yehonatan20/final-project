import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { LoginAuthService } from '../../services/loginAuth/login-auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  editMode: boolean = false;
  user = this.loginService.getCurrentUser();

  constructor(private loginService: LoginAuthService) {}

  saveChanges(event: SubmitEvent, username: string, password: string, email: string) {
    event.preventDefault();


  }

}
