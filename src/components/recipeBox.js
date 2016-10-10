var React     = require('react'),
    Recipe    = require('./recipe.js'),
    Store     = require('../flux/store.js'),
    Actions   = require('../flux/actions.js'),
    Button    = require('react-bootstrap').Button,
    Modal     = require('./modal.js'),
    ListGroup = require('react-bootstrap').ListGroup,
    Jumbotron = require('react-bootstrap').Jumbotron;

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
            <Jumbotron>
                <h1>Recipe Box</h1>
                <Modal 
                    recipe={newRecipe}
                    showModal={this.state.showModal}
                    hideModal={this._closeModal}
                    onSubmit={this._onSubmit}
                />    
                <ListGroup>
                    {listItems}
                </ListGroup>
                <Button
                    bsStyle="primary"
                    onClick={this._openModal}
                >
                New Recipe
                </Button>
            </Jumbotron>
        );
    },
    _onStateChange: function() {
        this.setState({
            recipes: getRecipes()
        });
    },
    _onSubmit: function(recipe) {
        Actions.createRecipe(recipe);
        this.setState({showModal: false});
    },
    _openModal: function() {
        this.setState({
            showModal: true
        });
    },
    _closeModal: function(){
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