import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginAuthService } from '../../services/loginAuth/login-auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private loginUrl: string = "http://localhost:3000/api/v1/login"; // Your backend login endpoint
  message: string = '';

  constructor(private http: HttpClient, private registerService: LoginAuthService) {}

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
        }
      });
  }
}
