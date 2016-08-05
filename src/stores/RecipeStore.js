var Dispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/RecipeContants.js');
var Assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _recipes = {};

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
 * Update existing recipes
 * @param {id} string
 * @param {object} updates An object literal containing only updates
 */
 function update(id, updates){
     _recipes[id] = Assign({}, _recipes[id], updates);
 }
 
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

module.exports = recipeStore;