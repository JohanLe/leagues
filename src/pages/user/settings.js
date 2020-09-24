import React, { Component } from "react";
// import Auth from "../../firebase/auth.js";
import Database from "../../firebase/database.js";
import firebase from "firebase/app";
import "firebase/auth";

//const auth = new Auth();
const db = new Database();

export default class RegisterUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hcp: -99,
      golfId: "",
      firstName: "",
      lastName: "",
      email: "",
    };

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  submitForm(event) {
    event.preventDefault();
    try {
      console.log(this.state);
      db.updateUser(this.state.uid, {
        golfId: this.state.golfId,
        hcp: this.state.hcp,
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    let userData;
    let that = this;
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        let userData = await db.getUser(user.uid);
        that.setState({
          uid: user.uid,
          hcp: userData.hcp.hcp ?? -99,
          golfId: userData.golfId ?? "",
          firstName: userData.firstName ?? "",
          lastName: userData.lastName ?? "",
          email: userData.email ?? "",
        });
  
      } else {
        console.log("User signed OUT");
      }
    });
  }

  editSettingsForm() {
    return (
      <form
        className='form register-form'
        onSubmit={this.submitForm}
        method='POST'
      >
        <label>
          <span>HCP</span>
          <input
            name='hcp'
            type='number'
            value={this.state.hcp}
            onChange={this.onChange}
          />
        </label>

        <label>
          <span>Golf id</span>
          <input
            name='golfId'
            type='text'
            value={this.state.golfId}
            onChange={this.onChange}
          />
        </label>

        <label>
          <span>First name</span>
          <input
            name='firstName'
            type='text'
            value={this.state.firstName}
            onChange={this.onChange}
          />
        </label>
        <label>
          <span>Last name</span>
          <input
            name='lastName'
            type='text'
            value={this.state.lastName}
            onChange={this.onChange}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            name='email'
            type='email'
            value={this.state.email}
            onChange={this.onChange}
          />
        </label>

        <input name='submit' type='submit' />
      </form>
    );
  }

  render() {
    return <div>{this.editSettingsForm()}</div>;
  }
}
