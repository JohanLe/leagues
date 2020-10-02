import React, { useContext, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../firebase/auth";
import sessionHelper from "../../helpers/session";
import NavItem from "./item";
const ssh = new sessionHelper();
const Navbar = (props) => {

  const [children, setChildren] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const sortNavitems = async () => {
    let items;
    const userData = ssh.get("user");
    if (currentUser && userData) {
      items = props.children.map((child) => {
        if (child.props.title === "User") {
          console.log(userData);
          return (
            <NavItem
              key={child.props.href}
              title={userData.firstName}
              href={child.props.href}
              always={child.hasOwnProperty(child.props.always) ? true : false}
              protected={
                child.hasOwnProperty(child.props.protected) ? true : false
              }
            >
              {child.props.children}
            </NavItem>
          );
        } else if (child.props.title === "League") {
          return (
            <NavItem
              key={child.props.href}
              title={userData.leagues[0].name}
              href={`/league/${userData.leagues[0].pathName}`}
              always={child.hasOwnProperty(child.props.always) ? true : false}
              protected={
                child.hasOwnProperty(child.props.protected) ? true : false
              }
            >
              {child.props.children}
            </NavItem>
          );
        } else if (
          child.props.hasOwnProperty("always") ||
          child.props.hasOwnProperty("protected")
        ) {
          return child;
        }
      });
    } else {
      items = props.children.map((child) => {
        if (
          child.props.hasOwnProperty("always") ||
          !child.props.hasOwnProperty("protected")
        ) {
          return child;
        }
      });
    }
    return items;
  };
  useEffect(() => {
    let items = sortNavitems();
    items.then((res) => {
      setChildren([res]);
    });
  }, []);

  return (
    <nav className='navbar'>
      <ul className='navbar-nav'>{children}</ul>
    </nav>
  );
};

export default Navbar;
