var React = require('react');
var Ingredients = require('./ingredients.js');
var Form = require('./form.js');
var Actions= require('../flux/actions.js');

var Recipe = React.createClass({
    getInitialState: function(){
        return {isEditing: false}
    },
    render: function() {
        var form;
        var editing = '';
        if(this.state.isEditing){
            editing = 'editing';
            form = (<Form onSave = {this._onSave}
                    recipe = {this.props.recipe}/>);
        }
        
        return (
            <li key={this.props.recipe.id}>
                className = {editing}
                    <span>{this.props.recipe.name}</span>
                    <Ingredients ingredients={this.props.recipe.ingredients}/>
                    <button onClick={this._onDelete}>delete </button>
                    <button onClick={this._onEdit}>Edit</button>
                    {form}
            </li>
        );
    },
    _onDelete: function() {
        Actions.destroyRecipe(this.props.recipe.id);
    },
    _onEdit: function() {
        this.setState({isEditing: true});
    },
    _onSave: function(){
        Actions.createRecipe(this.props.recipe);
    }
});

module.exports = Recipe;