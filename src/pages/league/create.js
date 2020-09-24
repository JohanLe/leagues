import React, { Component } from "react";
import Database from "../../firebase/database.js";
import firebase from "firebase/app";
import "firebase/auth";

//const auth = new Auth();
const db = new Database();

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  submitForm(event) {
    event.preventDefault();
    try {
      db.createLeague(this.state.uid, this.state.name);
    } catch (error) {
      console.log("ERROR");
      console.log(error);
    }
  }
  createLeague() {
    try{
        db.createLeague(this.state.uid, this.state.name);
    }catch{

    }
  }
  createForm() {
    return (
      <form onSubmit={this.submitForm}>
        <label>
          <input
            name='name'
            type='text'
            required
            onChange={this.onChange}
          ></input>

          </label>
          <input type="submit" value="Submit"/>
     </form>
    );
  };

  componentDidMount(){
      let that = this;
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
          that.setState({uid: user.uid});
        } else {
          console.log("Sign in to create league");
        }
      });
  }
  render() {
    return <div>{this.createForm()}</div>;
  }
}
