import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent{
  loginMode = true;

  constructor( private authService: AuthService) {}

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    if (this.loginMode){
      //....
    } else{
      this.authService.signUp(email,password).subscribe(
        responseData => {
          console.log(responseData);
      },
        error => {
          console.log(error);
        }
      );
    }
    form.reset();
  }
}