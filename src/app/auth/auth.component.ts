import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService, AuthResponseData } from './auth.service';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit,OnDestroy{
  loginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false})  alertHost: PlaceholderDirective;
  closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
    ) {}

  ngOnInit() {
    this.store.select('auth').subscribe( authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid){
      return;
    }
    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    let authObservable: Observable<AuthResponseData>;

    if (this.loginMode){
      //authObservable = this.authService.login(email,password)
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    } else{
      //authObservable = this.authService.signUp(email,password)
      this.store.dispatch(new AuthActions.SignUpStart({email: email, password: password}));
    }

    // authObservable.subscribe(
    //   responseData => {
    //     console.log(responseData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    // },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );
    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  // implemented to showcase the dynamic component loader approach
  // of dynamic components
  private showErrorAlert(message: string){
    // naive expectation to programmatically instantiate a component
    // const alertCmp = new AlertComponent()
    // its valid ts/js code but Angular needs more than that
    // the component needs to be instantiated via the Angular ecosystem

    // the below property is a factory that 'knows' how to instantiate AlertComponents
    const alertCmpFactry = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    // access the public ViewContainerReference of the directive which
    // gives us access and complete power over the element
    // hosting the directive and which is the tool that has the power
    // to alter the DOM as we wish
    const hostViewContainer = this.alertHost.viewContainerRef;
    hostViewContainer.clear();
    // access to the reference of the created component
    const componentRef = hostViewContainer.createComponent(alertCmpFactry);
    // with instance we access th actual instance of the component that was created
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe( ()=> {
      this.closeSub.unsubscribe();
      hostViewContainer.clear()
    })
    }

  }

