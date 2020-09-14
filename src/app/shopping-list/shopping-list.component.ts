import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: Ingredient[] = [
    new Ingredient('Apples',5),
    new Ingredient('Banana',4)];


  constructor() { }

  ngOnInit(): void {
  }

  // $event is the information passed
  // so in this case its just an Ingredient
  onAddedIngredient($event){
    this.ingredients.push($event);
  }

}
