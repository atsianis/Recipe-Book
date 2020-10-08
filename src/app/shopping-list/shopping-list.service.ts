import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService{

    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

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

    getIngredient(index: number): Ingredient{
      return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
      this.ingredients[index] = newIngredient;
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient( index: number ) {
      this.ingredients.splice(index,1);
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients:Ingredient[]){

        // ... -> spread operator
        // spreads the array to a list of elements
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}
