import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './components/App'
import AddRecipe from './components/AddRecipe'
import rootReducer from './reducers/root'
import { BrowserRouter as Router, Route, browserHistory} from 'react-router-dom'
import { getAllRecipes } from './actions/actions'

const store = createStore(rootReducer, applyMiddleware(thunk))
store.dispatch(getAllRecipes());

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('root')
)