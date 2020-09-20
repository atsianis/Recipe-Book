import { Recipe } from './recipe.model';
import { EventEmitter } from '@angular/core';

export class RecipeService{

    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe('A Test Recipe','test','https://www.seriouseats.com/2019/07/20190618-grilled-turkish-chicken-wings-vicky-wasik-13.jpg'),
        new Recipe('An other Test Recipe','test2','https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNYQQ4cKBHDkYH2OSw50lSVSrqsUBddUrTBw&usqp=CAU')
      ];

    getRecipes() {
        return this.recipes.slice();
    }

}