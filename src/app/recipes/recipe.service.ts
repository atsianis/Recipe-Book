import { Recipe } from './recipe.model';
import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

export class RecipeService{

    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe('Chicken Wings',
        'Yummy chicken wings with tomato sauce',
        'https://www.seriouseats.com/2019/07/20190618-grilled-turkish-chicken-wings-vicky-wasik-13.jpg',
        [new Ingredient("Chicken Wings",10), new Ingredient("Tomatoes", 3), new Ingredient("Olive Oil",1)]),
        new Recipe('Clam Noodles',
        'Noodles with clams, vegetables and sweet sauce',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNYQQ4cKBHDkYH2OSw50lSVSrqsUBddUrTBw&usqp=CAU',
        [new Ingredient("Noodles",3), new Ingredient("Clams", 10), new Ingredient("Veggetables",6)])
      ];

    getRecipes() {
        return this.recipes.slice();
    }

}