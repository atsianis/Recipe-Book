import { Ingredient } from '../shared/ingredient.model';
import { EventEmitter } from '@angular/core';

export class ShoppingListService{
    

    ingredientsChanged = new EventEmitter<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples',5),
        new Ingredient('Banana',4)];

    getIngredients(){
        // .slice() is used to return A COPY OF THE ARRAY, and not a reference
        // so when we call this method in a component, it will create a new array there
        // important to understand

        // this is why we need the ingredientsChanged eventEmitter
        //so that every time this list here updates
        //we also get an updated copy in our ShoppingListComponent

        // An easier way to do this, would be to remove the .slice()
        // and simply refer directly to this array
        //from the shoppingListComponent
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.emit(this.ingredients.slice());
    }

    addIngredients(ingredients:Ingredient[]){

        // ... -> spread operator
        // spreads the array to a list of elements
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.emit(this.ingredients.slice());
    }
    

}