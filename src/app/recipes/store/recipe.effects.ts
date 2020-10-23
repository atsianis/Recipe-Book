import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
    ){}

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap( () => {
      return this.http
      .get<Recipe[]>('https://recipebook-d75ae.firebaseio.com/recipes.json');
    }),
    map((recipes) => {
      return recipes.map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map( recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  )

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    // withLatestFrom injects the value from another observable in this observables stream
    // in switchMap now we automatically take as data, an object with 2 fields
    // the first one is about the action data and the second is the value that was 'injected' with withLatestFrom
    switchMap( ([actionData, recipesState]) => {
      return this.http.put('https://recipebook-d75ae.firebaseio.com/recipes.json', recipesState.recipes);
    })
  );

}
