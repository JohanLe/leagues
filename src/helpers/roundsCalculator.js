class RoundsCalculator {
  /**
   * @param {*}  Rounds to be calculated from
   * @param {*}  stat type of stats to calculate from (points, gross, net..)
   * Calculate total points for each player based.
   * @return Array of object sorted on points each player has. High -> low
   */

  compare(a, b, sortBy) {
    const bandA = a[sortBy];
    const bandB = b[sortBy];

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison * -1;
  }

  summarizeRounds(rounds, sortBy = "points") {
    let sum = [];
    console.log("rounds: ", rounds);
    rounds.forEach((round) => {
      console.log(round);
    });
    rounds.forEach((round) => {
      round.results.forEach((playerScore) => {
        let index = sum.findIndex(
          (prevScore) => prevScore.player.uid === playerScore.player.uid
        );
        if (index > -1) {
          sum[index].points += parseInt(playerScore.points);
          sum[index].gross += parseInt(playerScore.gross);
          sum[index].net += parseInt(playerScore.net);
        } else {
          sum.push(playerScore);
        }
      });
    });
    sum.sort(this.compare, sortBy);
    return sum;
  }

  /**
   * @param {*} rounds Rounds to be calculated from
   * @param {*} nRounds min Number of rounds to be used
   * @return Array of object sorted on points each player has. High -> low
   */
  mostPointsBestRounds(rounds, nRounds) {}
}

export default RoundsCalculator;
