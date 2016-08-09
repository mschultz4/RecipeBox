var React = require('react');
var Ingredients = require('./ingredients.js');
var Form = require('./form.js');
var Actions = require('../flux/actions.js');
var Assign = require('object-assign');

var Recipe = React.createClass({
    getInitialState: function() {
        return {
            isEditing: false
        }
    },
    render: function() {
        var form;
        var editing = '';
        if (this.state.isEditing) {
            editing = 'editing';
            form = (<Form onRecipeSubmit = {this._onSave}
                    recipe = {this.props.recipe}/>);
        }

        return (
            <li key={this.props.recipe.id}
                className = {editing}>
                    <span>{this.props.recipe.name}</span>
                    <Ingredients ingredients={this.props.recipe.ingredients}/>
                    <button className="btn btn-default"
                        onClick={this._onEdit} 
                        data-toggle="modal" 
                        data-target="#myModal">
                        Edit
                    </button>
                    <button className="btn btn-warning" onClick={this._onDelete}>delete</button>
                    {form}
            </li>
        );
    },
    _onDelete: function() {
        Actions.destroyRecipe(this.props.recipe.id);
    },
    _onEdit: function() {
        this.setState({
            isEditing: true
        });
    },
    _onSave: function(input) {
        Actions.updateRecipe(Assign({}, this.props.recipe, input));
        this.setState({
            isEditing: false
        });
    }
});

module.exports = Recipe;