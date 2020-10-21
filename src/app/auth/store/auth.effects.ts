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
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: string,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
  });
};

const handlError = (errorResponse) => {
  let errorMessage = 'An unknown error occured';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    // see firebase api for potential messages of sign in/up
    case 'EMAIL_NOT_FOUND':
      errorMessage = "This email doesn't exists";
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The email was found but the password is incorrect';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled by an administrator';
      break;
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Operation not allowed';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage =
        'Requests have been blocked due to unusual activity. Try again later';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignUpStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            environment.firebaseAPIKey,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          map((resData) => {
            return handleAuthentication(
              resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            );
          }),
          catchError((errorResponse) => {
            return handlError(errorResponse);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
            environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          map((resData) => {
            return handleAuthentication(
              resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            );
          }),
          catchError((errorResponse) => {
            return handlError(errorResponse);
          })
        );
    })
  );

  // We can have effects that dispatch no action
  // We have to let Angular know about this
  // and we do it with the following parametrization of the Decorator
  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
