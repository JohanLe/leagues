import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../firebase/auth";

const Navbar = (props) => {
  const { currentUser } = useContext(AuthContext);
  console.log("Is auth", currentUser);

  if (currentUser) {
  }
  return (
    <nav className='navbar'>
      <ul className='navbar-nav'>
        {props.children}
      </ul>
    </nav>
  );
};

export default Navbar;
