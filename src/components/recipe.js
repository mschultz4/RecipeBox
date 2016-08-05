var React = require('react');
var Ingredients = require('./ingredients.js');

var Recipe = React.createClass({
    render: function() {
        return (
            <li key={this.props.recipe.name}>
                    <span>{this.props.recipe.name}</span>
                    <Ingredients ingredients={this.props.recipe.ingredients}/>
                    <button onClick={this.handleDelete}>delete </button>
                    <button onClick={this.handleEdit}>Edit</button>
                </li>
        );
    },
    handleDelete: function() {
        this.props.onDelete(this.props.recipe.name);
    },
    handleEdit: function() {
        this.props.onEdit(this.props.recipe.name);
    }
});

module.exports = Recipe;