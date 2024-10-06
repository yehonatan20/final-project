import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {
 /* needs to fetch from DB instead of users[] */ 
 private users = [{username: "yoni", password: "123"}];
 private isLoggedIn: boolean = false;
 // username: string = '';
 
 constructor() { }

 login(username: string,password: string ) {
   this.users.forEach((user) => {
     if (user.username === username && user.password === password)
     {
       this.isLoggedIn = true;
       // this.username = username;
       return;
     }
   })
 }

 isLoggedin(): boolean {
   return this.isLoggedIn;
  }

}
