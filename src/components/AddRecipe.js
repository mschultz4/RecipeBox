import { connect } from 'react-redux';
import React from 'react';
import { saveRecipe } from '../actions/actions';


class AddRecipe extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			ingredientInput: '',
			ingredients: [],
			instructionInput: '',
			instructions: [],
			notes: '',
			favorite: false,
		};

		this._onSubmit = this._onSubmit.bind(this);
		this._onTitleInput = this._onTitleInput.bind(this);
		this._onIngredientInput = this._onIngredientInput.bind(this);
		this._onIngredientAdd = this._onIngredientAdd.bind(this);
		this._onInstructionInput = this._onInstructionInput.bind(this);
		this._onInstructionAdd = this._onInstructionAdd.bind(this);
		this._toggleFavorite = this._toggleFavorite.bind(this);
		this._onNotesInput = this._onNotesInput.bind(this);
	}

	render() {
		return (
			<form onSubmit={this._onSubmit} className="form">
				<div className="form-group">
					<label htmlFor="recipe-title">Title</label>
					<input
						type="text"
						name="recipe-title"
						onChange={this._onTitleInput}
						value={this.state.title}
						className="form-control"
						placeholder="Enter a title"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="ingredients">Ingredients</label>
					<ul>
						{this.state.ingredients.map((ing, index) => (
							<li key={index}>{ing.ingredient}</li>
						))}
					</ul>
					<div className="input-group">
						<input
							type="text"
							name="ingredients"
							onChange={this._onIngredientInput}
							value={this.state.ingredientInput}
							className="form-control"
							placeholder="Enter an ingredient"
						/>
						<span className="input-group-btn">
							<button
								className="btn btn-secondary"
								type="button"
								onClick={this._onIngredientAdd}
							>Add
							</button>
						</span>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="instructions">Instructions</label>
					<ul>
						{this.state.instructions.map((ins, index) => (
							<li key={index}>{ins.instruction}</li>
						))}
					</ul>
					<div className="input-group">
						<input
							type="text"
							name="instructions"
							onChange={this._onInstructionInput}
							value={this.state.instructionInput}
							className="form-control"
							placeholder="Enter an instruction"
						/>
						<span className="input-group-btn">
							<button
								className="btn btn-secondary"
								type="button"
								onClick={this._onInstructionAdd}
							>Add
							</button>
						</span>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="favorite">Favorite</label>
					<input
						name="favorite"
						className="form-control"
						checked={this.state.favorite}
						type="checkbox"
						onClick={this._toggleFavorite}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="notes">Notes</label>
					<textarea
						name="notes"
						className="form-control"
						value={this.state.notes}
						onInput={this._onNotesInput}
					/>
				</div>
				<input type="submit" className="btn btn-primary btn-block" value="save" />
			</form>
		);
	}


	_onTitleInput(e) {
		if (typeof e.target.value === 'string') {
			this.setState({
				title: e.target.value,
			});
		}
	}

	_onIngredientInput(e) {
		if (typeof e.target.value === 'string') {
			this.setState({
				ingredientInput: e.target.value,
			});
		}
	}


	_onIngredientAdd(e) {
		this.setState({
			ingredientInput: '',
			ingredients: [...this.state.ingredients, {
				ingredient: this.state.ingredientInput,
				sequence: (this.state.ingredients.length + 1),
			}],
		});
	}

	_onInstructionInput(e) {
		if (typeof e.target.value === 'string') {
			this.setState({
				instructionInput: e.target.value,
			});
		}
	}

	_onInstructionAdd(e) {
		this.setState({
			instructionInput: '',
			instructions: [...this.state.instructions, {
				instruction: this.state.instructionInput,
				sequence: (this.state.instructions.length + 1),
			}],
		});
	}

	_toggleFavorite(e) {
		this.setState({
			favorite: !this.state.favorite,
		});
	}

	_onNotesInput(e) {
		if (typeof e.target.value === 'string') {
			this.setState({
				notes: e.target.value,
			});
		}
	}

	_onSubmit(e) {
		e.preventDefault();
		this.props.dispatch(saveRecipe(this.state));

		this.setState({
			title: '',
			ingredientInput: '',
			ingredients: [],
			instructionInput: '',
			instructions: [],
			favorite: false,
			notes: '',
		});
	}


}

AddRecipe = connect()(AddRecipe);
export default AddRecipe;
