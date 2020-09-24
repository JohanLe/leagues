import React, { Component } from "react";
import SessionHelper from "../../helpers/session";
import Database from "../../firebase/database";
import Calc from "../../helpers/roundsCalculator";

const db = new Database();
const ssh = new SessionHelper();
const calc = new Calc();

export default class Home extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.displayLeaderboard = this.displayLeaderboard.bind(this);
  }

  // TODO Gör om och bryt ut till egen component
  displayLeaderboard() {
    return (
      <div className='leaderboard'>
        <h3>Leaderboard <span className="small-info-span">Sorted by points</span></h3>
        <div className='row row-header'>
          <div className='col'>Position</div>
          <div className='col'>Player</div>
          <div className='col'>Net score</div>
          <div className='col'>Gross score</div>
          <div className='col'>Points</div>
        </div>
        {this.state.league.leaderboard.map((score, index) => {
          return (
            <div className='row' key={score.player.uid}>
              <div className='col'>{index + 1}</div>
              <div className='col'>{score.player.name}</div>
              <div className='col'>{score.net}</div>
              <div className='col'>{score.gross}</div>
              <div className='col'>{score.points}</div>
            </div>
          );
        })}
      </div>
    );
  }

  async componentDidMount() {
    let that = this;
    //TODO selectedLeague - Fixa så man kan välja mellan flera ligor.
    let user = ssh.get("user");
    let selectedLeague = user.leagues[0];
    try {
      let lastUpdated = db.getLastUpdated("leagues", selectedLeague.id);
      /** Not up to date, download data. **/
      if (!ssh.isSessionDataUpToDate("league", lastUpdated)) {
        let leagueData = await db.getDocument("leagues", selectedLeague.id);
        let leagueRounds = await db.getCollectionOfDocument(
          "leagues",
          selectedLeague.id,
          "rounds"
        );

        let rounds = [];
        leagueRounds.forEach((doc) => {
          rounds.push(doc.data());
        });
        leagueData["leaderboard"] = calc.summarizeRounds(rounds, "points");;

        ssh.set("league", leagueData);
        that.setState({ league: leagueData });
      } else {
        let leagueData = await ssh.get("league");

        that.setState({ league: leagueData });
        console.log(that.state);
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div>
        {this.state.league ? (
          this.displayLeaderboard()
        ) : (
          <p>Leaderboard loading..</p>
        )}
      </div>
    );
  }
}
