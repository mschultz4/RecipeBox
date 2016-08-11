var React = require('react');
var Form = require('./form.js');
var Recipe = require('./recipe.js');
var Store = require('../flux/store.js');
var Actions = require('../flux/actions.js');
var Button = require('react-bootstrap').button;

var RecipeBox = React.createClass({
    getInitialState: function() {
        return {
            showModal: false,
            recipes: getRecipes()
        };
    },
    componentDidMount: function() {
        Store.addChangeListener(this._onStateChange);
    },
    componentWillUnmount: function() {
        Store.removeChangeListener(this._onStateChange);
    },
    render: function render() {
        var newRecipe = {
            name: '',
            ingredients: ''
        };
        var listItems = this.state.recipes.map(function(recipe) {
            return (
                <Recipe
                        key={recipe.id}
                        recipe={recipe}
                    />);
        });

        return (
            <div>
                <Form
                  onRecipeSubmit={this._onSubmit}
                  recipe={newRecipe}
                  showModal={this.state.showModal}
                  onHide={this._closeModal}
                 />
                <ul>{listItems}</ul>
                <Button
                    bsStyle="primary"
                    onClick={this.openModal}
                />
            </div>
        );
    },
    _onStateChange: function() {
        this.setState({
            recipes: getRecipes()
        });
    },
    _onSubmit: function(recipe) {
        Actions.createRecipe(recipe);
        this.setState({});
    },
    _openModal: function() {
        this.setState({
            showModal: true
        });
    },
    _closeModal: function() {
        this.setState({
            showModal: false
        });
    }
});

/**
 * Retrieve all recipe data from the Store
 * @returns {array} an array of recipe objects
 */
function getRecipes() {
    return Store.getAll();
}

module.exports = RecipeBox;