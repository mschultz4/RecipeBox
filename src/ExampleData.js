module.exports = {
    init: function(){
        var recipes = window.localStorage.getItem('recipes');
        if(!recipes){
            JSON.stringify([
                {
                    id: 1,
                    name: 'pasta',
                    ingredients: 'pasta, meatballs, salt'
                },
                {
                    id: 2,
                    name: 'cake',
                    ingredients: 'flour, sugar, chocolate'  
                }
                ]);
        }
    }
};