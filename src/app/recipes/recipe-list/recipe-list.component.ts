import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('A Test Recipe','test','https://www.seriouseats.com/2019/07/20190618-grilled-turkish-chicken-wings-vicky-wasik-13.jpg'),
    new Recipe('An other Test Recipe','test2','https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRNYQQ4cKBHDkYH2OSw50lSVSrqsUBddUrTBw&usqp=CAU')
  ];
  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelect(recipe:Recipe){
    this.recipeSelected.emit(recipe);
  }

}
