import { combineReducers } from 'redux';
import recipes from './recipes';
import fetchStatus from './fetchStatus';
import auth from './auth';

const recipeApp = combineReducers({ recipes, fetchStatus, auth });

export default recipeApp;
