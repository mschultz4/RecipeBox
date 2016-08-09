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
            //form = ();
        }

        return (
            <li key={this.props.recipe.id}
                className = {editing}>
                    <span>{this.props.recipe.name}</span>
                    <Ingredients ingredients={this.props.recipe.ingredients}/>
                    <button className="btn btn-default"
                        onClick={this._onEdit} 
                        data-toggle="modal" 
                        data-target="#myModal"
                        type="button">
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={this._onDelete}>delete</button>
                   <Form id="editForm" onRecipeSubmit = {this._onSave}
                    recipe = {this.props.recipe}/>
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