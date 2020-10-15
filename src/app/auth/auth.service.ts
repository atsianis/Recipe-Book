import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  local: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor( private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD5mGklS-2mpCFSzeFMKrFSJyuhTVn9AKE',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
      ).pipe(catchError(errorResponse => {
        let errorMessage = 'An unknown error occured';
        if(!errorResponse.error || !errorResponse.error.error){
          return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
          // see firebase api for potential messages
          case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists';
          case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'Operation not allowed';
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = 'Requests have been blocked due to unusual activity. Try again later';
        }
        return throwError(errorMessage);
      }));
  }
}
