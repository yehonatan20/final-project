import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuardGuard } from './guards/loginGuard/login-guard.guard';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BoardComponent } from './components/board/board.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path: "", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "lobby", canActivate: [loginGuardGuard], component: LobbyComponent},
    {path: "board"/*, canActivate: [loginGuardGuard]*/, component: BoardComponent},
    {path: "profile"/*, canActivate: [loginGuardGuard]*/, component: ProfileComponent},
    {path: "home"/*, canActivate: [loginGuardGuard]*/, component: HomeComponent}
];