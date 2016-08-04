/*global localStorage*/
var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var RecipeBox = require('./components/recipeBox.js')

    "use strict";

    // if no recipes in storage, set up example data
    (function () {
        var defaultRecipes ={
                'pasta': { name: 'pasta', 'ingredients': 'flour, water, salt', deleted: false },
                'cookie': { name: 'cookie', 'ingredients': 'flour, water, sugar', deleted: false }
            };

        if (!localStorage.getItem('recipes')) {
            localStorage.setItem('recipes', JSON.stringify(defaultRecipes));
        }
    })();


    ReactDOM.render(<RecipeBox/>, document.getElementById('recipes'));
