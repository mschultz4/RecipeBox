module.exports = {
    init: function() {
        var recipes;
        if (window.localStorage.getItem('recipes')) {
            return;
        }
console.log('hoo');
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