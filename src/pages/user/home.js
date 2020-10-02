import React, { Component } from "react";
import { Auth } from "../../firebase/auth.js";

const auth = new Auth();
export default class home extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        User home page. Display rounds here
        <button onClick={auth.signOut}>Signout</button>
      </div>
    );
  }
}
