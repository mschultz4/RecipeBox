module.exports = {
    init: function() {
        var recipes,
            savedRecipes = JSON.parse(window.localStorage.getItem('recipes'));
        if (savedRecipes && savedRecipes.length > 0) {
            return;
        }
        recipes = JSON.stringify([{
            id: 1,
            name: 'pasta',
            ingredients: 'pasta, meatballs, salt'
        }, {
            id: 2,
            name: 'cake',
            ingredients: 'flour, sugar, chocolate'
        }]);
        window.localStorage.setItem('recipes', recipes);

    }
};