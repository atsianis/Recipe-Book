import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes:Recipe[];
  recipeChanges: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
    ) {}

  ngOnDestroy(): void {
    this.recipeChanges.unsubscribe();
  }

  ngOnInit(): void {
    this.store.select('recipes')
    .pipe(map(
      recipesState => {return recipesState.recipes}
    ))
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }

}
