import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import AddRecipe from "./AddRecipe.js";
import Recipes from "./Recipes.js";
import Login from "./Login.js";
import Recipe from "./Recipe.js";

const App = ({ match }) => {
  return (
    <div className="container">
      <Navbar />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/new" component={AddRecipe} />
        <Route path="/Recipes" component={Recipes} />
        <Route path="/recipes/:id" component={Recipe} />
      </Switch>
    </div>
  );
};

export default App;
