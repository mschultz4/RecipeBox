  var React = require('react');

  var Ingredients = React.createClass({
      render: function render() {
          var listItems = this.props.ingredients.replace(/\s/g, '').split(',').map(function(ingredient) {
              return (
                  <li key={ingredient}>
                        {ingredient}
                    </li>
              );
          }, this);

          return (<ul>{listItems}</ul>);
      }
  });

  module.exports = Ingredients;