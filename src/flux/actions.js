var WebAPIUtils = require('./WebAPIUtils.js');
var Dispatcher = require('./dispatcher.js');
var Constants = require('./constants.js');

var actions = {
    recieveAllRecipes: function () {
        var recipes = WebAPIUtils.getAllRecipes();
        Dispatcher.dispatch({
            type: Constants.RECIEVE_RECIPES,
            recipes: recipes
        });
    },
    destroy: function(id){
        WebAPIUtils.destroyRecipe(id);
        Dispatcher.dispatch({
            type = Constants.RECIPE_DESTROY,
            id = id
        });

    }
};

module.exports = actions; 