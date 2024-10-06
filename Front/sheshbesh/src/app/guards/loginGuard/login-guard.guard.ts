import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginAuthService } from '../../services/loginAuth/login-auth.service';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  const loginAuthService = inject(LoginAuthService);
  const router = inject(Router);

  if (loginAuthService.isLoggedin())
    return true;
  else
  {
    router.navigate(['']);
    return false;
  }
};
