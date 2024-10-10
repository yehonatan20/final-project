import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuardGuard } from './guards/loginGuard/login-guard.guard';
import { LobbyComponent } from './components/lobby/lobby.component';
import { GameComponent } from './components/game/game.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    {path: "", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "lobby", canActivate: [loginGuardGuard], component: LobbyComponent},
    {path: "game", canActivate: [loginGuardGuard], component: GameComponent},
    {path: "profile", canActivate: [loginGuardGuard], component: ProfileComponent}
];