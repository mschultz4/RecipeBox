/*global localStorage*/
var ReactDOM = require('react-dom');
var RecipeBox = require('./components/recipeBox.js');
var ExampleData = require('./ExampleData.js');

"use strict";

ExampleData.init();


ReactDOM.render(<RecipeBox/>, document.getElementById('recipes'));
