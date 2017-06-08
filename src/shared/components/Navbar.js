import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
    <button
      type="button"
      className="navbar-toggler navbar-toggler-right"
      data-toggle="collapse"
      data-target="#navbar-content"
      aria-controls="navbar-content"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <a className="navbar-brand" href="#">Test</a>
    <div className="collapse navbar-collapse" id="navbar-content">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <Link to="/recipes" className="nav-link">
            Home<span className="sr-only">Current</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/new" className="nav-link">New</Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">Login</Link>
        </li>
      </ul>

      <form className="form-inline my-2 my-lg-0">
        <input
          type="text"
          className="form-control mr-sm-2"
          placeholder="Search"
        />
        <button type="submit" className="btn btn-outline-success my-2 my-sm-0">
          Search
        </button>
      </form>
    </div>

  </nav>
);

export default Navbar;
