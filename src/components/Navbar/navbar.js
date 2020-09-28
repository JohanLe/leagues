import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../firebase/auth";

const Navbar = (props) => {
  const [children, setChildren] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    let dropdownItems;
    console.log("dropdown props: ", props);
    if (currentUser) {
      dropdownItems = props.children.map((child) => {
        console.log("child: ", child);
        if (child.props.hasOwnProperty("protected") && child.props.protected || child.props.hasOwnProperty("always"))
          return child;
      });
    } else {
      dropdownItems = props.children.map((child) => {
        if (!child.props.hasOwnProperty("protected")) return child;
      });
    }
    setChildren([dropdownItems]);
    console.log({ children });
  });
  return (
    <nav className='navbar'>
      <ul className='navbar-nav'>
        {children}
      </ul>
    </nav>
  );
};

export default Navbar;
