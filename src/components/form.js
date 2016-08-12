var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;

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
          <label htmlFor="name" >Name</label>
          <input
            id="name"
            type="text"
            onChange={this._onNameInput}
            value={this.state.name}/>
          <label htmlFor="ingredients">Ingredients</label>
          <input
            id="ingredients"
            type="text"
            onChange={this._onIngredientInput}
            value={this.state.ingredients}/>
          <button className="btn btn-default">Submit</button>
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