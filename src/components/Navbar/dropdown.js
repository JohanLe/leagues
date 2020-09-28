import React, { Component, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../firebase/auth";

const Dropdown = (props) => {
  const [children, setChildren] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    let dropdownItems;
    if (currentUser) {
      dropdownItems = props.children.map((child) => {
        if (child.props.hasOwnProperty("protected") && child.props.protected || child.props.hasOwnProperty("always"))
          return child;
      });
    } else {
      dropdownItems = props.children.map((child) => {
        if (!child.props.hasOwnProperty("protected")) return child;
      });
    }
    setChildren([dropdownItems]);
  });
  return <div className='dropdown'>{children}</div>;
};
export default Dropdown;
