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
    render: function render() {
        var listItems = this.state.map(function(recipe) {           
                return (
                    <Recipe
                    key={recipe.id}
                    recipe={recipe}/>);
        });

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