import { Component } from '@angular/core';
import { LoginAuthService } from '../../services/loginAuth/login-auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  message: string = '';

  constructor(private registerService: LoginAuthService, private popup: NotifierService) {}

  register(event:Event ,username:string, password:string, email:string) {
    event.preventDefault();

    this.registerService.register(username, password, email)
      .subscribe(response => {
        if (response.success) {
          // If login is successful, navigate or show a success message
          // this.message = response.message;
          // console.log('Register user:', response.user);
          window.close();
        } else {
          // If login fails, show an error message
          this.message = response.message || 'Register failed. Please try again.';
          this.popup.notify('error', this.message);
        }
      });
  }
}
