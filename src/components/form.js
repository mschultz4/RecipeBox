var React = require('react');

    var Form = React.createClass({
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
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="name" >Name</label>
                    <input
                        id="name"
                        type="text"
                        onChange={this.handleNameInput}
                        value={this.state.name}/>
                    <label htmlFor="ingredients">Ingredients</label>
                    <input
                        id="ingredients"
                        type="text"
                        onChange={this.handleIngredientInput}
                        value={this.state.ingredients}/>
                    <button className="btn btn-default">Submit</button>
                </form>
            );
        }
    });
    
module.exports = Form;