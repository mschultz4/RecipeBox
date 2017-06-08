import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ title, id }) => (
  <li className="list-group-item">
    <div className="col-sm-8">
      <h4 className="card-title">{title}</h4>
      <p className="card-text">Maybe some description</p>
    </div>
    <div className="col-sm-4">
      <Link to={`/recipes/${id}`} className="btn btn-primary">Make it</Link>
    </div>
  </li>
);

export default RecipeCard;
