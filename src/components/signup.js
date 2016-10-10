var React = require('react');
var Button       = require('react-bootstrap').Button,
    FormGroup    = require('react-bootstrap').FormGroup,
    FormControl  = require('react-bootstrap').FormControl,
    ControlLabel = require('react-bootstrap').ControlLabel;

var Signin = React.createClass({
  getInitialState: function() {
    return {
      email: "", 
      password: "",
    };
  },
  render: function() {
    return (
        <form onSubmit={this._onSubmit}>
          <FormGroup>
          <ControlLabel htmlFor="email" >Email</ControlLabel>
          <FormControl
            id="email"
            type="text"
            onChange={this._onEmailInput}
            value={this.state.email}/>
          <ControlLabel htmlFor="password">Password</ControlLabel>
          <FormControl
            id="password"
            type="text"
            onChange={this._onPasswordInput}
            value={this.state.password}/>
          <Button type='submit'>Submit</Button>
          </FormGroup>
        </form>
    );
  },
  _onEmailInput: function(e) {
    if (typeof e.target.value === 'string') {
      this.setState({
        email: e.target.value
      });
    }
  },
  _onPasswordInput: function(e) {
    if (typeof e.target.value === 'string') {
      this.setState({
        password: e.target.value
      });
    }
  },
  _onSubmit: function(e) {
    e.preventDefault();
    var email = this.state.email;
    var password = this.state.password;
    
    if (!email || !password) {
      return;
    }
  }
});

module.exports = Signin;
