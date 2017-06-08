import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import App from "../shared/components/App.js";
import rootReducer from "../shared/reducers/root";
import {
  BrowserRouter as Router,
  browserHistory,
  Route
} from "react-router-dom";
import { getAllRecipes } from "../shared/actions/actions";

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

// const store = createStore(rootReducer,  applyMiddleware(thunk));
// store.dispatch(getAllRecipes());

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
