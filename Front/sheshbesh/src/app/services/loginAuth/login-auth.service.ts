import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {
  private loginUrl: string = "http://localhost:3000/api/v1/login"; // Your backend login endpoint
  private registerUrl: string = "http://localhost:3000/api/v1/register"; // Your backend login endpoint
  private isLoggedIn: boolean = false;  // Tracks login status
  private currentUser: any = null;      // Stores logged-in user info
 // username: string = '';
//  isLogin = this.http.get<{message: string}>(this.loginUrl)
//       .subscribe(
//         data => this.message = data.message,
//         error => console.error('Error fetching data:', error)
//       );
 constructor(private http: HttpClient) { }

 // Function to perform login with backend API
 login(identifier: string, password: string): Observable<any> {
  const body = { identifier, password };  // Data to be sent to the API

  return this.http.post<{ message: string, user: any }>(this.loginUrl, body)
    .pipe(
      map(response => {
        if (response.user) {
          // If login is successful, update status and user information
          this.isLoggedIn = true;
          this.currentUser = response.user;
          return { success: true, user: response.user };
        } else {
          // If login fails, return failure
          return { success: false, message: response.message };
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({ success: false, message: 'Login failed. Please try again.' });
      })
    );
}

  register(username:string, password:string, email:string): Observable<any> {
    const body = { username, password, email};  // Data to be sent to the API

    return this.http.post<{ message: string, user: any }>(this.registerUrl, body).pipe(
      map(response => {
        if (response.user) {
          return { success: true, user: response.user };
        } else {
          // If login fails, return failure
          return { success: false, message: response.message };
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({ success: false, message: 'Login failed. Please try again.' });
      })
    );
  }

 isLoggedin(): boolean {
   return this.isLoggedIn;
  }

  // Method to get the current user data
  getCurrentUser(): any {
    return this.currentUser;
  }
}
