var React = require('react');
var Button = require('react-bootstrap').Button;
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var ControlLabel = require('react-bootstrap').ControlLabel;

var Form = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.recipe.name, 
      ingredients: this.props.recipe.ingredients,
      showModal: this.props.showModal
    };
  },
  render: function() {
    return (
        <form onSubmit={this._onSubmit}>
          <FormGroup>
          <ControlLabel htmlFor="name" >Name</ControlLabel>
          <FormControl
            id="name"
            type="text"
            onChange={this._onNameInput}
            value={this.state.name}/>
          <ControlLabel htmlFor="ingredients">Ingredients</ControlLabel>
          <FormControl
            id="ingredients"
            type="text"
            onChange={this._onIngredientInput}
            value={this.state.ingredients}/>
          <Button type='submit'>Submit</Button>
          </FormGroup>
        </form>
    );
  },
  _onIngredientInput: function(e) {
    if (typeof e.target.value === 'string') {
      this.setState({
        ingredients: e.target.value
      });
    }
  },
  _onNameInput: function(e) {
    if (typeof e.target.value === 'string') {
      this.setState({
        name: e.target.value
      });
    }
  },
  _onSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name;
    var ingredients = this.state.ingredients;
    
    if (!name || !ingredients) {
      return;
    }

    this.props.onRecipeSubmit({
      name: name,
      ingredients: ingredients
    });
    this.setState({
      name: '',
      ingredients: []
    });
  }
});

module.exports = Form;