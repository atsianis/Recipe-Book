import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        //this.recipe = this.recipeService.getRecipe(this.id);

        // we have an observable inside an observable here
        // we could use switch map to handle it as one observable
        // remember: simply put, switch map exchanges the outside observable with the inside observable
        this.store.select('recipes').pipe(map(
          recipesState => {
            return recipesState.recipes.find((recipe, index) => {
              return index === this.id;
            })
          }
        )).subscribe(recipe => {
          this.recipe = recipe;
        });
      }
    )
  }

  onAddToShoppingList(){
    this.recipeService.sendIngredientsToShoppingList(this.recipe.ingredients);
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['../'],{relativeTo: this.route})
  }
}
