SELECT json_agg ( json_build_object 
    ( 'title', recipes.title
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
FROM recipes 