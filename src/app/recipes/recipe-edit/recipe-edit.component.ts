import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id:number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        // above we check if there is an id in the url, if there is, then we are in edit mode
        this.initForm();
      }
    );
  }

  private initForm() {
    let recipeName =  '';
    let recipeImagePath = '';
    let description = '';
    let ingredients = new FormArray([]);

    if( this.editMode ) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      description = recipe.description;
      if ( recipe['ingredients'] ) {
        for( let ingredient of recipe.ingredients ){
          ingredients.push(new FormGroup({
            'name': new FormControl(ingredient.name),
            'amount': new FormControl(ingredient.amount)
          }))
        }
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName,Validators.required),
      'imagePath': new FormControl(recipeImagePath,Validators.required),
      'description': new FormControl(description,Validators.required),
      'ingredients': ingredients
    })
  }

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit(){
    console.log(this.recipeForm);
  }

}
