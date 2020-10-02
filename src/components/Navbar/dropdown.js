import React, { useContext } from "react";
import { AuthContext } from "../../firebase/auth";

const Dropdown = (props) => {
  const { currentUser } = useContext(AuthContext);

  return <div className='dropdown'>{props.children}</div>;
};
export default Dropdown;
