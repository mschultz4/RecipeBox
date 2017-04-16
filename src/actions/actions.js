import 'whatwg-fetch'

const hasErrored = (bool) => ({ type: 'HAS_ERRORED', hasErrored: bool });
const isLoading = (bool) => ({ type: 'IS_LOADING', isLoading: bool });
const receivedAll = (data) => ({ type: 'RECEIVED_ALL', recipes: data });

export const destroyRecipe = recipeid => ({ type: RECIPE_DESTROY, recipeid });
export const updateRecipe = recipe => ({ type: RECIPE_UPDATE, recipe });

export const addRecipe = recipe => ({ type: 'ADD_RECIPE', recipe });

export const getAllRecipes = () => {
    return (dispatch) => {
        dispatch (isLoading(true));

        fetch('api/recipes')
            .then((res) => {
                if (!res.ok) throw Error(res.statusText);

                dispatch(isLoading(false));
                return res.json();
            })
            .then(data => dispatch(receivedAll(data.recipes)))
            .catch(() => hasErrored(true));
    }
};