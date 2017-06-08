import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onEmailInput: value =>
    dispatch({ type: "UPDATE_FIELD_AUTH", key: "email", value }),
  onPasswordInput: value =>
    dispatch({ type: "UPDATE_FIELD_AUTH", key: "password", value })
});

class Login extends React.Component {
  constructor() {
    super();
    this._onEmailInput = e => this.props.onEmailInput(e.target.value);
    this._onPasswordInput = e => this.props.onPasswordInput(e.target.value);
    this._onSubmit = () => console.log("submit");
  }
  render() {
    return (
      <div>
        <form onSubmit={this._onSubmit} className="form">
          <div className="form-group">
            <label htmlFor="recipe-title">Email</label>
            <input
              type="text"
              name="email"
              onChange={this._onEmailInput}
              value={this.props.email}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="recipe-title">Password</label>
            <input
              type="text"
              name="password"
              onChange={this._onPasswordInput}
              value={this.props.password}
              className="form-control"
              placeholder="Enter your password"
            />
          </div>
          <a className="btn btn-secondary" type="button" href="/auth/google">
            Authenticate
          </a>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
