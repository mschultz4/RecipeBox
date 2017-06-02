import 'whatwg-fetch';

const hasErrored = bool => ({ type: 'HAS_ERRORED', hasErrored: bool });
const isLoading = bool => ({ type: 'IS_LOADING', isLoading: bool });
const receivedAll = data => ({ type: 'RECEIVED_ALL', recipes: data });
const addRecipe = recipe => ({ type: 'ADD_RECIPE', recipe });
const destroyRecipe = recipeid => ({ type: 'DESTROY_RECIPE', recipeid });

export const saveRecipe = recipe => (dispatch) => {
	dispatch(isLoading(true));

	fetch('api/saverecipe', {
		method: 'post',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(recipe),
	})
        .then(res => {
            if (!res.ok) throw Error(res.statusText);

            dispatch(isLoading(false));
            return res.json();
        })
        .then((data) => {
            recipe.id = data.recipeid;
            dispatch(addRecipe(recipe));
        })
        .catch(() => hasErrored(true));
};

export const getAllRecipes = () => (dispatch) => {
	dispatch(isLoading(true));

	fetch('api/recipes')
            .then((res) => {
	if (!res.ok) throw Error(res.statusText);

	dispatch(isLoading(false));
	return res.json();
})
            .then(data => dispatch(receivedAll(data.recipes)))
            .catch(() => hasErrored(true));
};

export const deleteRecipe = id => (dispatch) => {
	console.log(JSON.stringify(id))
	fetch('deleterecipe', {
		method: 'post',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify({recipeId: id}),
	})
    .then(() => dispatch(destroyRecipe(id)))
    .catch(() => hasErrored(true));
};
