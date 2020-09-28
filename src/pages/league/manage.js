import React, { Component } from "react";
import Database from "../../firebase/database.js";
import firebase from "firebase/app";
import "firebase/auth";

const db = new Database();
/**
 * TODO: Allow only admins to enter this page.
 */
export default class Manage extends Component {
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
    /**
     * Invite a member to the league by their golf ID
     */
    try {
      db.invitePlayerWithGolfId(
        this.state.leagueId,
        this.state.golfId,
        this.state.inviter
      );
    } catch (error) {
      console.log("ERROR");
      console.log(error);
    }
  }

  inviteForm() {
    return (
      <form className='form form-btn-right' onSubmit={this.submitForm}>
        <label>
          <span>Invite player with Golf ID</span>

          <input
            name='golfId'
            type='text'
            required
            onChange={this.onChange}
          ></input>
        </label>
        <input className="submit" type='submit' value='Add' />
      </form>
    );
  }

  /**
   * Get users league
   */
  componentDidMount() {
    let that = this;
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        let userData = await db.getUser(user.uid);
        console.log(userData);
        that.setState({
          leagueId: userData.leagues[0].id,
          inviter: {
            name: userData.firstName + " " + userData.lastName,
            uid: user.uid,
          },
        });
      } else {
        console.log("User signed OUT");
      }
    });
  }

  render() {
    return <div>{this.inviteForm()}</div>;
  }
}
