import { connect } from 'react-redux'
import Recipes from './Recipes'

const mapStateToProps = (state) => ({
  recipes: state.recipes 
})

const VisibleRecipes = connect(mapStateToProps)(Recipes);

export default VisibleRecipes