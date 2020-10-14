import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent{
  loginMode = true;

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }
}
