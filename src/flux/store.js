var Dispatcher = require('./dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./constants.js');
var Assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

//bootstrap storage if none exists
  
var _recipes = [];
 
var recipeStore = Assign({}, EventEmitter.prototype,{
    /**
   * Get all recipes
   * @return {object}
   */
  getAll: function() {
    return _recipes;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
}); 

var name,
    ingredients,
    id;

//Register the store
Dispatcher.register(function(action){
    switch(action.type){
        case Constants.RECIPE_CREATE:
            name = action.name.trim();
            ingredients = action.ingredients.trim();
            id = action.id;
            create(id, name, ingredients);
            recipeStore.emitChange();
            break;
        
        case Constants.RECIPE_DESTROY:
           destroy(action.id);
           recipeStore.emitChange();
           break;
           
        case Constants.RECIPE_UPDATE:
            name = action.name;
            ingredients = action.ingredients;
            update(action.id, {name: name, ingredients: ingredients});
            recipeStore.emitChange();
            break;
            
        case Constants.RECEIVE_RECIPES:
            receiveAllRecipes(action.recipes);
            recipeStore.emitChange();
            break;
        default:
        //do nothing
    }
});

/**
 * Create a new recipe
 * @param {num} id 
 * @param {string} name
 * @param {string} ingredients
 */
function create(id, name, ingredients) {
    _recipes.push({
        id: id,
        name: name,
        ingredients: ingredients
    });
}

/**
 * Destroy a recipe
 * @param {string} id
 */
function destroy(id){
   var index = _.findIndex(_recipes, function(o){
       return o.id == id;
   }); 
     _recipes.splice(index, 1);
     
}

/**
 * Update an existing recipe
 * @param {string} id
 * @param {object} updates An object literal containing only updates
 */
 function update(recipe){
     var index = _.findIndex(_recipes, function(o){
         return o.id === recipe.id;
     });
     _recipes[index] = Assign({}, _recipes[index], recipe);
 }

/**
 * Receive all recipes from storage
 * @param {array} recipes An array of recipe objects
 */
 function receiveAllRecipes(recipes){
     _recipes = recipes;
 }
 

module.exports = recipeStore;