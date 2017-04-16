let insertRecipe = 
    `INSERT INTO recipes (title, notes, favorite) 
    VALUES ($[title], $[notes], $[favorite]) 
    RETURNING recipeid`;

let insertIngredient = 
    `INSERT INTO ingredients (recipeid, ingredient, sequence) 
    VALUES ($[recipeid], $[ingredient], $[sequence])`;

let insertInstruction = 
    `INSERT INTO instructions (recipeid, instruction, sequence) 
    VALUES ($[recipeid], $[instruction], $[sequence])`;

let selectRecipes = 
    `SELECT json_agg ( json_build_object 
        ( 'id', recipes.recipeid
        , 'title', recipes.title
        , 'notes', recipes.notes
        , 'favorite', recipes.favorite
        , 'ingredients', ( 
            SELECT json_agg ( json_build_object 
                ( 'ingredient', ingredients.ingredient 
                , 'sequence', ingredients.sequence
                )
            ) 
            FROM ingredients 
            WHERE recipes.recipeid = ingredients.recipeid
            ) 
        , 'instructions', ( 
            SELECT json_agg ( json_build_object 
                ( 'instruction', instructions.instruction
                , 'sequence', instructions.sequence
                )
            ) 
            FROM instructions 
            WHERE recipes.recipeid = instructions.recipeid
            ) 
        )
    ) as recipes
    FROM recipes`;
    
module.exports = { 
    insertRecipe,
    insertIngredient,
    insertInstruction,
    selectRecipes
};