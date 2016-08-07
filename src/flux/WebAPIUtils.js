var _ = require('lodash');

var dataAccessLayer = {
    getAllRecipes: function() {
        return JSON.parse(window.localStorage.getItem('recipes'));
    },
    updateRecipe: function(recipe){
        var rawRecipes = JSON.parse(window.localStorage.getItem('recipes'));
        var index = _.findIndex(rawRecipes, function(o) { return o.id == recipe.id; });
        rawRecipes[index] = recipe;
        
        window.localStorage.setItem('recipes', JSON.stringify(rawRecipes));
    },
    destroyRecipe: function(id){
        var rawRecipes = JSON.parse(window.localStorage.getItem('recipes'));
        var index = _.findIndex(rawRecipes, function(o) { return o.id == id; });
        rawRecipes.splice(index,1);
        
        window.localStorage.setItem('recipes', JSON.stringify(rawRecipes));
    },
    /**
     * create new recipe in local storage
     * @param {object} recipe Object with two properties: name and ingredients array
     */
    createRecipe: function(recipe){
        var newRecipe;
        var rawRecipes = JSON.parse(window.localStorage.getItem('recipes'));
        newRecipe = {
            id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
            name: recipe.name,
            ingredients: recipe.ingredients
        };
        rawRecipes.push(newRecipe);
        
        window.localStorage.setItem('recipes', JSON.stringify(rawRecipes));
        return newRecipe;
    }
};

module.exports = dataAccessLayer;