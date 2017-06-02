import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { deleteRecipe } from '../actions/actions.js';

const mapStateToProps = (state, ownProps) => {
	const found = _.find(state.recipes, { id: parseInt(ownProps.match.params.id, 10) });

	return ({
		recipe: found,
	});
};

const mapDispatchToProps = (dispatch) => {
	return {
		onDeleteRecipe : id => dispatch(deleteRecipe(id))
	}
};

const Recipe = ({ recipe, onDeleteRecipe }) => {
	const ingredientsElement = recipe.ingredients ?
        recipe.ingredients.map((ing, index) => (<li key={index}>{ing.ingredient}</li>))
        : 'No ingredients';

	const instructionsElement = recipe.instructions ?
        recipe.instructions.map((ins, index) => (<li key={index}>{ins.instruction}</li>))
        : 'No instructions';

	return (
  <div>
    <h4>{recipe.title}</h4>
    <p className="lead">{recipe.notes}</p>
    <div className="row">
      <div className="col-sm-3">
        <h5 >Ingredients</h5>
        <ol>{ingredientsElement}</ol>
      </div>
      <div className="col-sm-9">
        <h5 className="card-title">Instructions</h5>
        <ol>{instructionsElement}</ol>
      </div>
    </div>
    <h5>Favorite</h5>
    <p>{recipe.favorite ? 'true' : 'false'}</p>
    <h5>Notes</h5>
    <p>{recipe.notes}</p>
    <button className="btn btn-secondary" onClick={() => onDeleteRecipe(recipe.id)}>Delete</button>
  </div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipe);