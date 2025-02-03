import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    map(user => {
      if (user) {
        return true; // ✅ Allow access if user is logged in
      } else {
        router.navigate(['/login']); // 🔒 Redirect to login if not authenticated
        return false;
      }
    })
  );
};
