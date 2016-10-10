"use strict";

var ReactDOM    = require('react-dom'),
    React       = require('react'),
    RecipeBox   = require('./components/recipeBox.js'),
    ExampleData = require('./ExampleData.js'),
    Actions     = require('./flux/actions.js');

ExampleData.init();
Actions.receiveAllRecipes();

ReactDOM.render(<RecipeBox/>, document.getElementById('recipes'));
