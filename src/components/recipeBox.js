var React = require('react');
var Form = require('./form.js');
var Recipe = require('./recipe.js');
var Store = require('../flux/store.js');
var Actions = require('../flux/actions.js');

/**
 * Retrieve all recipe data from the Store
 */
function getState() {
  return {
    recipes: Store.getAll()
  };
}


var RecipeBox = React.createClass({
    getInitialState: function() {
        return  getState();
    },
    componentDidMount: function(){
        Store.addChangeListener(this._onStateChange);
    },
    componentWillUnmount: function(){
        Store.removeChangeListener(this._onStateChange);
    },
    render: function render() {
        var listItems = this.state.recipes.map(function(recipe) {           
                return (
                    <Recipe
                        key={recipe.id}
                        recipe={recipe}/>);
        });

        return (
            <div>
                <Form
                  onRecipeSubmit={this._onSubmit}
                  // editRecipe={}
                 />
                <ul>{listItems}</ul>
            </div>
        );
    },
    _onStateChange: function(){
        this.setState(getState());
    },
    _onSubmit: function(recipe){
        Actions.createRecipe(recipe);
        this.setState({});
    }
});

module.exports = RecipeBox;