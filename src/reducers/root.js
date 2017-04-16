import { combineReducers } from 'redux'
import recipes from './recipes'
import fetchStatus from './fetchStatus'

const recipeApp = combineReducers({recipes, fetchStatus});

export default recipeApp