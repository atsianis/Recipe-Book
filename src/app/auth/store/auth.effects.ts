import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// 1.

// map, mergeMap and switchMap, exhaustMap and concatMap
// will transform the passed value and return an Observable for the result.

// 2.

// mergeMap and switchMap, exhaustMap and concatMap
// will additionally "flatten" an Observable of Observables to an Observable of normal values,
// by subscribing internally to the inner Observables.

// 3.

// switchMap will additionally unsubscribe from previous inner Observables
// each time a new value of the outer Observable arrives.

// Watch this funny video, and you will never forget what switchMap does:
// https://www.youtube.com/watch?v=rUZ9CjcaCEw

// 4.

// For the other ones please have a look at these articles:

// https://blog.angular-university.io/rxjs-higher-order-mapping/

// https://medium.com/@shairez/a-super-ninja-trick-to-learn-rxjss-switchmap-mergemap-concatmap-and-exhaustmap-forever-88e178a75f1b

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap( (authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map( resData => {
          const expirationDate = new Date( new Date().getTime() + +resData.expiresIn * 1000);
          return new AuthActions.Login({email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate: expirationDate});
        }),
        catchError( errors => {
          return of();
        })
      )
    }),
  );

  // We can have effects that dispatch no action
  // We have to let Angular know about this
  // and we do it with the following parametrization of the Decorator
  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap( () => {
      this.router.navigate(['/']);
    })
  )

  constructor( private actions$: Actions, private http: HttpClient, private router: Router ) {}
}
