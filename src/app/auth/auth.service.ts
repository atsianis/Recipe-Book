import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  //userSubject = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
      ).pipe(catchError(this.handleError), tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
      ).pipe(catchError(this.handleError) ,tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      }));
  }

  autoLogin() {
    const userData:
    { email: string, id: string, _token: string, _tokenExpirationDate: string}
      = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      //this.userSubject.next(loadedUser);
      this.store.dispatch( new AuthActions.Login({email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate)}))
      const timeRemaining = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(timeRemaining);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout( () => {
      this.logout();
    }, expirationDuration)
  }

  logout() {
    //this.userSubject.next(null);
    this.store.dispatch( new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    // making sure to clear the expiration timer (if existing) when manually logging out
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleAuthentication( email: string, userId: string, token: string, expiresIn: number ){
    const expirationDate = new Date( new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    //this.userSubject.next(user);
    this.store.dispatch( new AuthActions.Login({email: email, userId: userId, token: token, expirationDate: expirationDate}));
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured';
        if(!errorResponse.error || !errorResponse.error.error){
          return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
          // see firebase api for potential messages of sign in/up
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email doesn\'t exists';
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
              errorMessage = 'Requests have been blocked due to unusual activity. Try again later';
              break;
        }
        return throwError(errorMessage);
  }
}
