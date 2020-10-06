class RoundsCalculator {
  /**
   *
   */
  sortArrayOfObject(arr, sortBy) {
    return arr.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
  }
  /**
   * Find index of player in sum
   * @param {} uid
   */
  playerExistsInSum = (sum, uid) => {
    let playerIndex = null;
    sum.forEach((player, index) => {
      if (player.player.uid === uid) {
        playerIndex = index;
      }
    });
    return playerIndex;
  };
  /**
   * Summerize each players score from each rounds.
   * @param {*} rounds
   * @param {*} sortBy
   * @returns Array of objects
   */
  //TODO Flytta till cloud functions för att kunna hämta en färdig sorterad lista.
  // Alt. För varje runda - skapa ett doc med leadaren
  summarizeRounds(rounds) {
    let sum = [];
    let playerIndexes = [];
    rounds.forEach((round) => {
      round.results.forEach((res) => {
        let playerIndex = this.playerExistsInSum(sum, res.player.uid);

        if (playerIndex == "0" || playerIndex) {
          let player = sum[playerIndex];
          player.points += parseInt(res.points);
          player.net += parseInt(res.net);
          player.gross += parseInt(res.gross);
          player.rounds += 1;
          sum[playerIndex] = player;
        } else {
          let player = {
            points: parseInt(res.points),
            net: parseInt(res.net),
            gross: parseInt(res.gross),
            rounds: 1,
            player: { uid: res.player.uid, name: res.player.name },
          };
          sum.push(player);
        }
      });
    });
    sum = this.sortArrayOfObject(sum, "points");
    console.log(sum);
    return sum;
  }
}

export default RoundsCalculator;
