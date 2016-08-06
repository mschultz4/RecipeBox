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
    }
};

module.exports = actions; 