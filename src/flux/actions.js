var WebAPIUtils = require('./WebAPIUtils.js'),
    Dispatcher  = require('./dispatcher.js'),
    Constants   = require('./constants.js'),
    Assign      = require('object-assign');

var actions = {
    receiveAllRecipes: function() {
        var recipes = WebAPIUtils.getAllRecipes();
        console.log(recipes);
        Dispatcher.dispatch({
            type: Constants.RECEIVE_RECIPES,
            recipes: recipes
        });
    },
    destroyRecipe: function(id) {
        WebAPIUtils.destroyRecipe(id);
        Dispatcher.dispatch({
            type: Constants.RECIPE_DESTROY,
            id: id
        });

    },
    createRecipe: function(recipe) {
        var newRecipe = WebAPIUtils.createRecipe(recipe);
        Dispatcher.dispatch(Assign({}, newRecipe, {
            type: Constants.RECIPE_CREATE
        }));
    },
    updateRecipe: function(recipe){
        WebAPIUtils.updateRecipe(recipe);
        Dispatcher.dispatch(Assign({}, {recipe: recipe}, {type: Constants.RECIPE_UPDATE}));
    }
};

module.exports = actions;