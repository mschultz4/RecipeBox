var _ = require('lodash');

function recipeBox() {
    "use strict";

    // if no recipes in storage, set up example data
    (function () {
        var defaultRecipes =
            {
                'pasta': { name: 'pasta', 'ingredients': 'flour, water, salt', deleted: false },
                'cookie': { name: 'cookie', 'ingredients': 'flour, water, sugar', deleted: false }
            };

        if (!localStorage.getItem('recipes')) {
            localStorage.setItem('recipes', JSON.stringify(defaultRecipes));
        }
    })();


    var RecipeBox = React.createClass({ 
        getInitialState: function () {
            var recipes = localStorage.getItem('recipes');
            return JSON.parse(recipes);
        },
        handleRecipeSubmit: function (recipe) {
            this.setState({ [recipe.name]: { name: recipe.name, ingredients: recipe.ingredients } }, function () {
                localStorage.setItem('recipes', JSON.stringify(this.state));
            });
        },
        handleDelete: function (recipe) {
            var recipes = _.extend({}, this.state);
            recipes[recipe].deleted = true;
            this.setState(recipes);
            localStorage.setItem('recipes', JSON.stringify(this.state));
        },
        render: function render() {
            var listItems = Object.keys(this.state).map(function (key) {
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
                        editRecipe={}/>
                    <ul>{listItems}</ul>
                </div>
            );
        }
    });

    var Form = React.createClass({
        getInitialState: function () {
            return { name: '', ingredients: [] };
        },
        handleIngredientInput: function (e) {
            if (typeof e.target.value === 'string') {
                this.setState({ ingredients: e.target.value.trim() });
            }
        },
        handleNameInput: function (e) {
            if (typeof e.target.value === 'string') {
                this.setState({ name: e.target.value.trim() });
            }
        },
        handleSubmit: function (e) {
            e.preventDefault();
            var name = this.state.name;
            var ingredients = this.state.ingredients;
            if (!name || !ingredients) { return; }

            this.props.onRecipeSubmit({ name: name, ingredients: ingredients });
            this.setState({ name: '', ingredients: [] });
        },
        render: function () {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="name" >Name</label>
                    <input
                        id="name"
                        type="text"
                        onChange={this.handleNameInput}
                        value={this.state.name}/  >
                    <label htmlFor="ingredients" >Ingredients</label>
                    <input
                        id="ingredients"
                        type="text"
                        onChange={this.handleIngredientInput}
                        value={this.state.ingredients}/  >
                    <button className="btn btn-default" >Submit</button>
                </form>
            );
        }
    });

    var Recipe = React.createClass({
        render: function () {
            return (
                <li key={this.props.recipe.name}>
                    <span>{this.props.recipe.name}</span>
                    <Ingredients ingredients={this.props.recipe.ingredients}/>
                    <button onClick={this.handleDelete}>delete </button>
                    <button onClick={this.handleEdit}>Edit</button>
                </li>
            );
        },
        handleDelete: function () {
            this.props.onDelete(this.props.recipe.name);
        },
        handleEdit: function () {
            this.props.onEdit(this.props.recipe.name);
        }
    });

    var Ingredients = React.createClass({
        render: function render() {
            var listItems = this.props.ingredients.replace(/\s/g, '').split(',').map(function (ingredient) {
                return (
                    <li key={ingredient}>
                        {ingredient}
                    </li>
                );
            }, this);

            return (<ul>{listItems}</ul>);
        }
    });


    ReactDOM.render(<RecipeBox/>, document.getElementById('recipes'));
}

module.exports = recipeBox;