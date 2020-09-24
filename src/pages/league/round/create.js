import React, { Component } from "react";
import Database from "../../../firebase/database.js";
import firebase from "firebase/app";
import "firebase/auth";

const db = new Database();

// FIXME Se till att alldata spras i session
export default class newRound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      leagueData: {
        members: [],
      },
    };
    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.addScore = this.addScore.bind(this);
  }

  onChange(event) {
    // FIXME Se till att alldata spras i session. Om är äldre än.. 30? min ta bort från session.
    this.setState({ [event.target.name]: event.target.value });
  }

  submitForm(event) {
    event.preventDefault();
    /**
     * Invite a member to the league by their golf ID
     */
    try {
      let roundData = {
        club: parseInt(this.state.club),
        course: this.state.course,
        date: parseInt(this.state.date),
        results: parseInt(this.state.results),
      };
      db.registerNewRound(roundData, this.state.leagueId);
    } catch (error) {
      console.log("ERROR");
      console.log(error);
    }
  }

  addScore(event) {
    event.preventDefault();
    let prevRes = this.state.results;
    prevRes.push({
      player: JSON.parse(this.state.player),
      gross: this.state.gross,
      net: this.state.net,
      points: this.state.points,
    });

    this.setState({ results: prevRes });
    console.log(this.state.results);
  }
  playerScoreForm() {
    return (
      <div>
        <form className='register-player-score-form'>
          <label>
            <select name='player' onChange={this.onChange} required>
              <option value='' disabled selected key='disabled'>
                Player
              </option>
              {this.state.leagueData.members.length > 0 ? (
                this.state.leagueData.members.map((member) => {
                  return (
                    <option
                      value={JSON.stringify({
                        name: member.name,
                        uid: member.uid,
                      })}
                      key={member.golfId}
                    >
                      {member.name}
                    </option>
                  );
                })
              ) : (
                <option value='' disabled selected key='LoadingPlayers'>
                  Loading players..
                </option>
              )}
            </select>
          </label>
          <label>
            Gross
            <input
              name='gross'
              type='number'
              onChange={this.onChange}
              required
            />
          </label>
          <label>
            Net
            <input name='net' type='number' onChange={this.onChange} required />
          </label>
          <label>
            Points
            <input
              name='points'
              type='number'
              onChange={this.onChange}
              required
            />
          </label>
        </form>
        <button onClick={this.addScore}>Add</button>
      </div>
    );
  }
  courseForm() {
    return (
      <div>
        <form className='register-player-score-form'>
          <label>
            Club
            <input name='club' type='text' onChange={this.onChange} required />
          </label>
          <label>
            Course
            <input
              name='course'
              type='text'
              onChange={this.onChange}
              required
            />
          </label>
          <label>
            date
            <input name='date' type='date' onChange={this.onChange} required />
          </label>
        </form>
        <button onClick={this.submitForm}>Submit</button>
      </div>
    );
  }
  componentDidMount() {
    let that = this;
    firebase.auth().onAuthStateChanged(async function (user) {
      let userData;
      if (user) {
        let userData = await db.getUser(user.uid);
        let leagueId = userData.leagues[0].id;

        let league = await db.getDocument("leagues", leagueId);
        that.setState({
          leagueId: leagueId,
          leagueData: league,
        });
        console.log();
      } else {
        console.log("User signed OUT");
      }
    });
  }
  render() {
    return (
      <div>
        {this.state.results.length > 0 ? (
          <div>
            {this.state.results.map((tempScore) => {
              return (
                <div key={tempScore.player.uid}>
                  {tempScore.player.name}
                  Net: {tempScore.net}
                  Gross: {tempScore.gross}
                  Points: {tempScore.points}
                </div>
              );
            })}
          </div>
        ) : (
          <div> Inga resultat reggade </div>
        )}

        {this.playerScoreForm()}
        {this.courseForm()}
      </div>
    );
  }
}
