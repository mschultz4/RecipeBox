import React from 'react'
import Recipe from './Recipe'

const Recipes = ({ recipes }) => (
    <div>
        <ul>
        {recipes.map(recipe => (
            <Recipe
                key={recipe.id}
                {...recipe}
            />)
        )}
    </ul>
    </div>
);

export default Recipes

