import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../App';
import logo from '../images/logo.png';

const Navbar = () => {
  const { state, } = useContext(UserContext);

  const RenderMenu = () => {
    if (state) {
      return (
        <>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/">Home<span className="sr-only"></span></NavLink>
          </li>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/getstarted">Interview<span className="sr-only"></span></NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">About</NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
          </li> */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/logout">LogOut</NavLink>
          </li>
        </>
      )
    } else {
      return (
        <>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/">Home<span className="sr-only"></span></NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/registration">Registration</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">Login</NavLink>
          </li>
          <li className="nav-item active">
            <NavLink className="nav-link" to="/getstarted">Interview<span className="sr-only"></span></NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">About</NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
          </li> */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/logout">LogOut</NavLink>
          </li>
        </>
      )
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light background">
        <NavLink className="navbar-brand" to="/">
          <img src={logo} alt="Logo" height="" className="d-inline-block align-top" />
          &nbsp;&nbsp;&nbsp;MockGuru
        </NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <RenderMenu />
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar;
