import React, { Component } from "react";
import LeagueInvites from "../components/leagueInvite";
import Database from "../firebase/database.js";
import firebase from "firebase/app";
import "firebase/auth";

const db = new Database();

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "empty",
    };
    //  this.createInvite = this.createInvite.bind(this);
    //  this.createInviteContainer = this.createInviteContainer.bind(this);
  }
  componentDidMount() {
    let that = this;
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        let userData = await db.getUser(user.uid);
        that.setState({
          user: userData,
          uid: user.uid,
        });
        console.log(that.state.user);
      } else {
        console.log("User signed OUT");
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.user ? (
          <div>
            <p>Signed in as: </p>
            <h4>
              {this.state.user.firstName} {this.state.user.lastName}
            </h4>

            <LeagueInvites
              invites={this.state.user.leagueInvites}
              uid={this.state.uid}
            />
          </div>
        ) : (
          "Loading.."
        )}
      </div>
    );
  }
}
