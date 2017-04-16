const recipe = (state, action) => {
    console.log(action)
    switch (action.type) {
        case 'ADD_RECIPE':
            return {
                id : action.recipe.id,
                title: action.recipe.title,
                ingredients: action.recipe.ingredients,
                instructions: action.recipe.instructions,
                notes: action.recipe.notes,
                favorite: action.recipe.favorite
            }
        default:
            return state

    }
}

const recipes = (state = [], action) => {
    switch (action.type) {
        case 'ADD_RECIPE':
            return [...state, recipe(undefined, action)];
        case 'RECEIVED_ALL':
            return [...action.recipes];
        default:
            return state
    }
}

export default recipes