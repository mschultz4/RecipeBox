var Dispatcher = require('./dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./constants.js');
var Assign = require('object-assign');

var CHANGE_EVENT = 'change';

//bootstrap storage if none exists
  
var _recipes = {};
 
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
    ingredients;

//Register the store
Dispatcher.register(function(action){
    switch(action){
        case Constants.RECIPE_CREATE:
            name = action.name.trim();
            ingredients = action.ingredients.trim();
            create(name, ingredients);
            this.emitChange();
            break;
        
        case Constants.RECIPE_DESTROY:
           destroy(action.id);
           this.emitChange();
           break;
           
        case Constants.RECIPE_UPDATE:
            name = action.name;
            ingredients = action.ingredients;
            update(action.id, {name: name, ingredients: ingredients});
            this.emitChange();
            break;
        default:
        //do nothing
    }
});

/**
 * Create a new recipe
 * @param {string} name The recipe name
 * @param (string) ingredients The comma delmited list of ingredients
 */
function create(name, ingredients) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _recipes[id] = {
        id: id,
        complete: false,
        name: name,
        ingredients: ingredients
    };
}

/**
 * Destroy a recipe
 * @param {string} id
 */
function destroy(id){
    delete _recipes[id];
}

/**
 * Update an existing recipe
 * @param {id} string
 * @param {object} updates An object literal containing only updates
 */
 function update(id, updates){
     _recipes[id] = Assign({}, _recipes[id], updates);
 }
 

module.exports = recipeStore;