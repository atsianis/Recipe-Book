import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { exhaustMap, take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>){}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    //return this.authService.userSubject.pipe(
    return this.store.select('auth').pipe(
      take(1),
      map( authState => {
        return authState.user;
      }),
      exhaustMap( user => {
        // check if we dont have a user, which means that the outgoing request is a log in or a sign up
        // in that case there is no meaning of attaching token to the request
        // alternatively we could check the url of the request to filter out when we want the
        // headers to be attached
        if (!user){
          return next.handle(request);
        }
        const modifiedRequest = request.clone({params: new HttpParams().set('auth', user.token)})
        return next.handle(modifiedRequest);
    }));

  }
}
