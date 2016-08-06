/*global localStorage*/

var React = require('react');
var _ = require('lodash');
var Form = require('./form.js');
var Recipe = require('./recipe.js');
var Store = require('../flux/store.js');

/**
 * Retrieve all recipe data from the Store
 */
function getState() {
  return {
    allTodos: Store.getAll()
  };
}


var RecipeBox = React.createClass({
    getInitialState: function() {
        return getState();
    },
    componentDidMount: function(){
        Store.addChangeListener(this._onStateChange);
    },
    componentWillUnmount: function(){
        Store.removeChangeListener(this._onStateChange);
    },
    handleRecipeSubmit: function(recipe) {

        this.setState({
            name: {
                name: recipe.name,
                ingredients: recipe.ingredients
            }
        }, function() {
            localStorage.setItem('recipes', JSON.stringify(this.state));
        });
    },
    handleDelete: function(recipe) {
        var recipes = _.extend({}, this.state);
        recipes[recipe].deleted = true;
        this.setState(recipes);
        localStorage.setItem('recipes', JSON.stringify(this.state));
    },
    render: function render() {
        var listItems = Object.keys(this.state).map(function(key) {
            if (!this.state[key].deleted) {
                return (<Recipe
          key={key}
          recipe={this.state[key]}
          onDelete={this.handleDelete}
          onEdit={this.handleEdit}/>);
            }
        }, this);

        return (
            <div>
                <Form
                  onRecipeSubmit={this.handleRecipeSubmit}
                  // editRecipe={}
                 />
                <ul>{listItems}</ul>
            </div>
        );
    },
    _onStateChange: function(){
        this.setState(getState());
    }
});

module.exports = RecipeBox;