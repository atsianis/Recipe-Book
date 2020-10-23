import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[]
}

const initialState: State = {
  recipes: []
}

export function recipeReducer( state = initialState, action: RecipesActions.RecipesActions ) {
  switch (action.type ) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes:[...state.recipes, action.payload]
      }
    case RecipesActions.UPDATE_RECIPE:
      // find the original recipe that we want to update
      // copy it so that we handle the state immutably
      // replace all the fields of that recipe with the fields of the new Recipe
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe
      };

      // insert the just updated recipe back in the recipes-list
      // and exactly at the index of the previous one
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      }
    case RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter( (recipe,index) => {
          return index !== action.payload;
        })
      }
    default:
      return state;
  }
}
