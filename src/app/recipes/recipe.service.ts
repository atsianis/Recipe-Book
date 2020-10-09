import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService{

    recipesChanged = new Subject<Recipe[]>();

    constructor(private shoppingListService: ShoppingListService){}

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

    getRecipe(id: number) {
        return this.recipes[id];
    }

    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
      this.recipes[index] = newRecipe;
      this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.recipesChanged.next(this.recipes.slice());
    }

    sendIngredientsToShoppingList(ingredients: Ingredient[]) {
            this.shoppingListService.addIngredients(ingredients)
        }


}
