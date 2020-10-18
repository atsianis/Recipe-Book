import { Ingredient } from '../shared/ingredient.model';

const initialState = {
  ingredients: [
    new Ingredient('Apples',5),
    new Ingredient('Banana',4)
  ]
};

// the function will be automatically called by ngRx and will be given the two parameters
// we are here assigning the js object as the initial state of the app, for demonstration purposes
// thats a TS feature, we can assign default values to function parameters in case they are not given by the caller
// so the first time the app state will be set to the default value we give it but for subsequent calls
// the state will always be the previous state
export function shoppingListReducer(state = initialState, action) {

}
