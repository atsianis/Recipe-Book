import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

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

  userSubject = new Subject<User>();

  constructor( private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD5mGklS-2mpCFSzeFMKrFSJyuhTVn9AKE',
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
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD5mGklS-2mpCFSzeFMKrFSJyuhTVn9AKE',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
      ).pipe(catchError(this.handleError) ,tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      }));
  }

  private handleAuthentication( email: string, userId: string, token: string, expiresIn: number ){
    const expirationDate = new Date( new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.userSubject.next(user);
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
