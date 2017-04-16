import React from 'react'
import { BrowserRouter as Router, Route, browserHistory, Link } from 'react-router-dom'
import VisibleRecipes from './VisibleRecipes'
import AddRecipe from './AddRecipe'
import Navbar from './Navbar'

const App = () => (
    <div className='container'>
        <Navbar />
        <Route exact path="/" component={VisibleRecipes} />
        <Route path="/New" component={AddRecipe} />
        <Route path="/Login" component={AddRecipe} />
    </div>
)

export default App