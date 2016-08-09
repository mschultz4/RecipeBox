var React = require('react');
var Form = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.recipe.name,
      ingredients: this.props.recipe.ingredients
    };
  },
  render: function() {
    return (
      <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="myModalLabel">Recipe</h4>
            </div>
              <form onSubmit={this._onSubmit}>
            <div className="modal-body" className='form-group'>
                <label htmlFor="name">Name</label>
                <input id="name" className="form-control" type="text" onChange={this._onNameInput} value={this.state.name}/>
                <label htmlFor="ingredients">Ingredients</label>
                <input id="ingredients" className="form-control" type="text" onChange={this._onIngredientInput} value={this.state.ingredients}/>
            </div>
            <div className="modal-footer">
              <button className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="submit" action="submit" className="btn btn-primary">Save</button>
            </div>
              </form>
          </div>
        </div>
      </div>
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