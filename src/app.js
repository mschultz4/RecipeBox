/*global localStorage*/
var ReactDOM = require('react-dom');

"use strict";

// if no recipes in storage, set up example data
(function() {
  var defaultRecipes = {
    'pasta': {
      name: 'pasta',
      'ingredients': 'flour, water, salt',
      deleted: false
    },
    'cookie': {
      name: 'cookie',
      'ingredients': 'flour, water, sugar',
      deleted: false
    }
  };

  if (!localStorage.getItem('recipes')) {
    localStorage.setItem('recipes', JSON.stringify(defaultRecipes));
  }
})();


ReactDOM.render(<RecipeBox/>, document.getElementById('recipes'));
