class RoundsCalculator {

  /**
   * @param {*}  Rounds to be calculated from
   * @param {*}  stat type of stats to calculate from (points, gross, net..)
   * Calculate total points for each player based.
   * @return Array of object sorted on points each player has. High -> low
   */
  compare(a, b, sortBy) {
    // FIXME fungerar ej.
    let comparison = 0;
    if (a[sortBy] > b[sortBy]) {
      comparison = 1;
    } else if (a[sortBy] < b[sortBy]) {
      comparison = -1;
    }
    return comparison * -1;
  }

  /**
   * Summerize each players score from each rounds. 
   * @param {*} rounds 
   * @param {*} sortBy 
   * @returns Array of objects
   */
  summarizeRounds(rounds, sortBy = "points") {
    let sum = [];
    rounds.forEach((round) => {
      round.results.forEach((playerScore) => {
        let index = sum.findIndex(
          (prevScore) => prevScore.player.uid === playerScore.player.uid
        );
        if (index > -1) {
          sum[index].points += parseInt(playerScore.points);
          sum[index].gross += parseInt(playerScore.gross);
          sum[index].net += parseInt(playerScore.net);
          sum[index].roundsPlayed += 1
        } else {
          let parsedScore = {
            points: parseInt(playerScore.points),
            gross: parseInt(playerScore.gross),
            net:  parseInt(playerScore.net),
            player: playerScore.player,
            roundsPlayed: 1
          }
          sum.push(parsedScore);
        }
      });
    });
   // sum.sort(this.compare, sortBy);
    return sum;
  }

}

export default RoundsCalculator;
