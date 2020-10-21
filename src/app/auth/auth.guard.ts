import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer'
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    //return this.authService.userSubject.pipe(
    return this.store.select('auth').pipe(
      // take() is used on BehaviorSubjects, we avoid subscribing, simply take the data that we need now
      take(1),
      map( authState => {
        return authState.user;
      }),
      map((user) => {
        const isAuth = user ? true : false;
        if (isAuth) {
          return true;
        }
        //Reference: https://juristr.com/blog/2018/11/better-route-guard-redirects/#new-returning-an-urltree
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
