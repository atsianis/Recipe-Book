import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private http: HttpClient, private recipesService: RecipeService, private authService: AuthService) {}

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

  /*
  There are also a couple of strange thigs happening here, after alteration of the method,
  that I'll try to explain here for future reading of the project
  1) We are subscribing to a BehaviorSubject, which gives us the opportunity to retrieve the previous state of
      it without having to subscribe to it like we do with regular Subjects. We do that by using the take RxJS operator.
      In simple words, what it does is that we only want to take 1 value from the observable and then automatically
      unsubscribe (it handles the subscription automatically). We are not getting informed for future changes here.
      We are only interested on values ON DEMAND !!
  2) We use the exhaustMap operator. What it does is that it WAITS until the previous observable is done and
      then essentially it REPLACES IT COMPLETELY with the observable inside it. So in the end the observable
      that is returned here is of http type, its the inside observable.
  3) Lastly, the reason why we did all the previous was because we wanted to retrieve the logged in user
      (from the first observable), so that we access his token and attach it to the
      http request that we are sending to Firebase. And that is exactly
      what we are doing in the second parameter of the request (remember that the last argument of all http
      requests is an object that is used to parametrize the request - add headers, parameters etc etc).
  */
  fetchRecipes(){
    return this.authService.userSubject.pipe(take(1), exhaustMap( user => {
      return this.http.get<Recipe[]>(
        'https://recipebook-d75ae.firebaseio.com/recipes.json',
        {
          params: new HttpParams().set('auth', user.token)
        }
      );
    }),map( recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      })
    }),tap ( recipes => {
      this.recipesService.setRecipes(recipes);
    })
  )
    }



  }


