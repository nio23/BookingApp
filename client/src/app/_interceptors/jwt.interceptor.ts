import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const user = accountService.currentUser();

  if(user){
    const token = user.token;
    const exp = new Date(JSON.parse(atob(token.split('.')[1])).exp * 1000);
    const currentDate = new Date();

    if(exp > currentDate){
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }else{
      console.warn('Token has expired');
      accountService.logout();
    }
  }
  return next(req);
};
