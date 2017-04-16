import React from 'react'

const Recipe = ({ title, ingredients, instructions, notes, favorite }) => {
    let ing;
    if (ingredients) {
        ing = ingredients.map((ing, index) => (<span key={index}>{ing.title + ' '}</span>))
    }
    else {
        ing = "No ingredients"
    }

    let instructionsElement = instructions ?
        instructions.map((ins, index) => (<span key={index}>{ins.title + ' '}</span>))
        : "No instructions";

return (
    <li >
        <dl className='row'>
            <dt className='col-sm-3'>Title</dt>
            <dd className='col-sm-9'>{title}</dd>
            <dt className='col-sm-3'>Ingredients</dt>
            <dd className='col-sm-9'>{ing}</dd>
            <dt className='col-sm-3'>Instructions</dt>
            <dd className='col-sm-9'>{instructionsElement}</dd>
            <dt className='col-sm-3'>Favorite</dt>
            <dd className='col-sm-9'>{favorite ? 'true' : 'false'}</dd>
            <dt className='col-sm-3'>Notes</dt>
            <dd className='col-sm-9'>{notes}</dd>
        </dl>
    </li>
)};

export default Recipe