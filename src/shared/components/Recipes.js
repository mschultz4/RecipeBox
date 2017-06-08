import React from 'react';
import RecipeCard from './RecipeCard';
import { connect } from 'react-redux';

const mapStateToProps = state => ({recipes: state.recipes});

const Recipes = ({ recipes }) => (
  <div>
    <ul className="list-group">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          {...recipe}
        />)
         )}
    </ul>
  </div>
);

export default connect(mapStateToProps)(Recipes);