import React, { Component, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../firebase/auth";

const Dropdown = (props) => {
  const [children, setChildren] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    let dropdownItems;
    console.log("dropdown props: ", props);
    if (currentUser) {
      dropdownItems = props.children.map((child) => {
        console.log("child: ", child);
        if (child.props.hasOwnProperty("protected") && child.props.protected)
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
  return <div className='dropdown'>{children}</div>;
};
export default Dropdown;
