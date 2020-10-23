import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  userSubscription: Subscription;
  isAuthenticated = false;

  constructor(
    private store: Store<fromApp.AppState>
  ){}

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {
    //this.userSubscription = this.authService.userSubject.subscribe( user => {
    this.store.select('auth').pipe(
      map( authState => {
        return authState.user;
      })
    ).subscribe( user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  onSavedData(){
    //this.dataStorageService.storeRecipes();
    this.store.dispatch( new RecipesActions.StoreRecipes());
  }

  onFetchData(){
    //this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch( new AuthActions.Logout());
  }
}
