import React, { Component } from "react";
import Database from "../firebase/database";
import firebase from "firebase/app";
import "firebase/functions";

const db = new Database();
export default class leagueInvite extends Component {
  constructor(props) {
    super(props);
    this.acceptInvite = this.acceptInvite.bind(this);
  }

  /**
   * Accepting an invite to a league
   * Call firebase cloud function
   * @userId  - players own userid
   * @leagueId - leagueID of league to join
   */
  acceptInvite(leagueId) {
    //TODO Deley on button press so no more then one acceptence is sent.
    // TODO Remove if accepted. and return to home page.

    let data = { leagueId: leagueId, uid: this.props.uid };

    let acceptInviteRef = firebase
      .functions()
      .httpsCallable("acceptLeagueInvite");

    acceptInviteRef(data).then((res) => {
      console.log("Recived data: ", res);

      // if OK return home and remove invite from frontend.
    });
  }
  /**
   * Declining an invite to a league
   * @userId  - players own userid
   * @leagueId - leagueID of league to decline
   */
  declineInvite(leagueId) {
    let data = { leagueId: leagueId, uid: this.props.uid };

    let declineInviteRef = firebase
      .functions()
      .httpsCallable("declineLeagueInvite");

    declineInviteRef(data).then((res) => {
      console.log("Recived data: ", res);

      // if OK return home and remove invite from frontend.
    });
  }

  createInvite(invite, key) {
    return (
      <div className='invite' key={key}>
        <p>
          {invite.leagueName} | Invited by {invite.inviter.name}
        </p>
        <button
          className='invite-btn-accept'
          onClick={() => this.acceptInvite(invite.leagueId)}
        >
          Accept
        </button>
        <button
          className='invite-btn-decline'
          onClick={() => this.declineInvite(invite.leagueId)}
        >
          Decline
        </button>
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.props.invites.length > 0 ? (
          <div className='invites-container'>
            {this.props.invites.map((invite, index) =>
              this.createInvite(invite, index)
            )}
          </div>
        ) : this.props.invites.hasOwnProperty("leagueId") ? (
          <div>{this.createInvite(this.props.invites, 0)}</div>
        ) : (
          <div>Nej</div>
        )}
      </div>
    );
  }
}
