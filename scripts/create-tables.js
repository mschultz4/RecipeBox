const pg               = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/recipebox';
const client           = new pg.Client(connectionString);

const createRecipesTable = 
    `CREATE TABLE recipes
    ( recipeId SERIAL PRIMARY KEY
    , title text not null
    , notes text 
    , favorite BOOLEAN
    );`;

const createIngredientsTable = 
    `CREATE TABLE ingredients
    ( ingredientsId SERIAL PRIMARY KEY
    , recipeId integer REFERENCES recipes
    , ingredient text not null
    , orderNumber integer not null
    );`;

const createInstructionsTable = 
    `CREATE TABLE instructions
    ( instructionsId SERIAL PRIMARY KEY
    , recipeId integer REFERENCES recipes
    , instruction text not null
    , orderNumber integer not null
    );`;

client.connect();
client.query(createRecipesTable + createIngredientsTable + createInstructionsTable)
    .then( () => client.end());

