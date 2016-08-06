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
    }
};

module.exports = dataAccessLayer;