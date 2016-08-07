var ReactDOM = require('react-dom');
var RecipeBox = require('./components/recipeBox.js');
var ExampleData = require('./ExampleData.js');
var Actions = require('./flux/actions.js');

"use strict";

ExampleData.init();
Actions.receiveAllRecipes();

ReactDOM.render(<RecipeBox/>, document.getElementById('recipes'));
