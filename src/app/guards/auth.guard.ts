import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    console.log('token found');
    
    return true;
  } else {
    console.log('token not found');
    
    router.navigate(['auth/signin']);
    return false;
  }
};
