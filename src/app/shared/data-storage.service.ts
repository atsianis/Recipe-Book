import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private http: HttpClient, private recipesService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http.put('https://recipebook-d75ae.firebaseio.com/recipes.json',recipes).subscribe( response => {
      console.log(response);
    });
  }
  /*
  In the fetchRecipes function we use two different map fuctions, We must make clear that the first incident
  is the rxjs operator that is used to change the observable's returned data before subscribing. The second
  one is the classic JS map function that is used on arrays. THEY ARE NOT THE SAME FUNCTION, JUST SAME NAME

  The proccess in the operator makes sure that if a recipe has no ingredient element ( in case that we create
  a recipe without adding any ingredients the ingredients array is not even initialized ), an empty one is created
  in order to avoid errors while manipulating the fetched recipe.
  */
  fetchRecipes(){
    return this.http
    .get<Recipe[]>(
      'https://recipebook-d75ae.firebaseio.com/recipes.json'
      )
      .pipe(
        map( recipes => {
          return recipes.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          })
        }),
        tap ( recipes => {
          this.recipesService.setRecipes(recipes);
        })
      )
  }

}
