import React, { Component } from "react";
import { Auth } from "../../firebase/auth.js";

const auth = new Auth();

export default class RegisterUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      hcp: 0,
      golfId: "",
    };

    this.onChange = this.onChange.bind(this);
    this.checkGolfId = this.checkGolfId.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  checkGolfId(event) {
    // DO some golfID check
    this.setState({ [event.target.name]: event.target.value });
  }
  submitForm(event) {
    event.preventDefault();
    try {
      auth.createUser({
        password: this.state.password,
        email: this.state.email,
      });
      // reset registerForm
    } catch (error) {
      console.log("ERROR");
      console.log(error);
    }
  }

  RegisterForm() {
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
        <label>
          Password again
          <input
            name='duplicatePassword'
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
    return <div>{this.RegisterForm()}</div>;
  }
}
