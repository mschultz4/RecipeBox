/*global localStorage*/
var _ = require('lodash');
var React = require('react');

function recipeBox() {
    "use strict";

    // if no recipes in storage, set up example data
    (function () {
        var defaultRecipes ={
                'pasta': { name: 'pasta', 'ingredients': 'flour, water, salt', deleted: false },
                'cookie': { name: 'cookie', 'ingredients': 'flour, water, sugar', deleted: false }
            };

        if (!localStorage.getItem('recipes')) {
            localStorage.setItem('recipes', JSON.stringify(defaultRecipes));
        }
    })();

    var RecipeBox = React.createClass({displayName: "RecipeBox", 
        getInitialState: function () {
            var recipes = localStorage.getItem('recipes');
            return JSON.parse(recipes);
        },
        handleRecipeSubmit: function (recipe) {
    
            this.setState({ name : { name: recipe.name, ingredients: recipe.ingredients } }, function () {
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
                    return (React.createElement(Recipe, {
                        key: key, 
                        recipe: this.state[key], 
                        onDelete: this.handleDelete, 
                        onEdit: this.handleEdit}));
                }
            }, this);

            return (
                React.createElement("div", null, 
                    React.createElement(Form, {
                        onRecipeSubmit: this.handleRecipeSubmit}
                       // editRecipe={}
                       ), 
                    React.createElement("ul", null, listItems)
                )
            );
        }
    });

    var Form = React.createClass({displayName: "Form",
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
                React.createElement("form", {onSubmit: this.handleSubmit}, 
                    React.createElement("label", {htmlFor: "name"}, "Name"), 
                    React.createElement("input", {
                        id: "name", 
                        type: "text", 
                        onChange: this.handleNameInput, 
                        value: this.state.name}/ ), 
                    React.createElement("label", {htmlFor: "ingredients"}, "Ingredients"), 
                    React.createElement("input", {
                        id: "ingredients", 
                        type: "text", 
                        onChange: this.handleIngredientInput, 
                        value: this.state.ingredients}/ ), 
                    React.createElement("button", {className: "btn btn-default"}, "Submit")
                )
            );
        }
    });

    var Recipe = React.createClass({displayName: "Recipe",
        render: function () {
            return (
                React.createElement("li", {key: this.props.recipe.name}, 
                    React.createElement("span", null, this.props.recipe.name), 
                    React.createElement(Ingredients, {ingredients: this.props.recipe.ingredients}), 
                    React.createElement("button", {onClick: this.handleDelete}, "delete "), 
                    React.createElement("button", {onClick: this.handleEdit}, "Edit")
                )
            );
        },
        handleDelete: function () {
            this.props.onDelete(this.props.recipe.name);
        },
        handleEdit: function () {
            this.props.onEdit(this.props.recipe.name);
        }
    });

    var Ingredients = React.createClass({displayName: "Ingredients",
        render: function render() {
            var listItems = this.props.ingredients.replace(/\s/g, '').split(',').map(function (ingredient) {
                return (
                    React.createElement("li", {key: ingredient}, 
                        ingredient
                    )
                );
            }, this);

            return (React.createElement("ul", null, listItems));
        }
    });


    React.render(React.createElement(RecipeBox, null), document.getElementById('recipes'));
}

module.exports = recipeBox;