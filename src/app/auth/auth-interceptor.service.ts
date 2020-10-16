import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor( private authService: AuthService){}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.userSubject.pipe(
      take(1),
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
