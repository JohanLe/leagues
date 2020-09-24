import React, { Component } from "react";
import Auth from "../../firebase/auth.js";
import Database from "../../firebase/database.js";
import Session from "../../helpers/session";

const auth = new Auth();
const db = new Database();
const ssh = new Session();

export default class RegisterUser extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async submitForm(event) {
    event.preventDefault();
    try {
      let uid = await auth.login({
        password: this.state.password,
        email: this.state.email,
      });
      let user = await db.getUser(uid);

      
      ssh.set("user", user);
      
      console.log("Signed in successfully");
      // reset registerForm
    } catch (error) {
      console.log("Sign in error:");
      console.log(error);
    }
  }

  LoginForm() {
    return (
      <form
        className='form register-form'
        onSubmit={this.submitForm}
        method='POST'
      >
        <label>
          Email
          <input name='email' type='email' required onChange={this.onChange} />
        </label>
        <label>
          Password
          <input
            name='password'
            type='password'
            required
            onChange={this.onChange}
          />
        </label>

        <input name='submit' type='submit' />
      </form>
    );
  }

  render() {
    return <div>{this.LoginForm()}</div>;
  }
}
