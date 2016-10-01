"use strict";

var ReactDOM = require('react-dom');
var React = require('react');
var RecipeBox = require('./components/recipeBox.js');
var ExampleData = require('./ExampleData.js');
var Actions = require('./flux/actions.js');

ExampleData.init();
Actions.receiveAllRecipes();

ReactDOM.render(<RecipeBox/>, document.getElementById('recipes'));
