import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../services/api.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if(this.api.isLoggedIn()) {      
      return true;
    }
    else{
      this.router.navigate(['login']);
    }
  }
}