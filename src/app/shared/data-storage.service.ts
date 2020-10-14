import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  fetchRecipes(){
    this.http.get<Recipe[]>('https://recipebook-d75ae.firebaseio.com/recipes.json').subscribe( recipes => {
      this.recipesService.setRecipes(recipes);
    })
  }

}
