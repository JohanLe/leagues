import React, { Component } from "react";
import { Auth } from "../../firebase/auth.js";

const auth = new Auth();
export default class home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
    if (this.props.auth) {
      console.log("IS AUTH");
    } else {
      console.log("NOT AUTH");
    }
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
