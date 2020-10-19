import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples',5),new Ingredient('Banana',4)],
  editedIngredient: null,
  editedIngredientIndex: -1
};

// the function will be automatically called by ngRx and will be given the two parameters
// we are here assigning the js object as the initial state of the app, for demonstration purposes
// thats a TS feature, we can assign default values to function parameters in case they are not given by the caller
// so the first time the app state will be set to the default value we give it but for subsequent calls
// the state will always be the previous state
export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch(action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      // copy of state
      // remember : THE UPDATE OF STATE MUST HAPPEN IMMUTABLY
      // WE MUST NOT TOUCH THE STATE OBJECT
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredient: [...state.ingredients, ...action.payload]
      }
    case ShoppingListActions.UPDATE_INGREDIENT:
      // getting the specific ingredient that we want to override from the state
      const ingredient = state.ingredients[action.payload.index];
      // copying the ingredient into another object because we cant directly touch the Store
      // NgRx STRONGLY SUGGESTS THAT REDUCERS AFFECT THE STORE IMMUTABLY
      // NOTE: The '...ingredient' is redundant because we coyld just enter the new ingredient
      // but in case that we had some other property that we wanted to be overriden we would have to use it
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient
      };
      // preparing the updated ingredients array that is going to replace the one in the Store
      const updatedIngredients = [...state.ingredients];
      // this is the final array that we are going to return
      updatedIngredients[action.payload.index] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        // this is the vanilla JS filter method
        ingredients: state.ingredients.filter( (ingredient, index) => {
          return index !== action.payload;
        })
      };
    default:
      return state;
  }
}
