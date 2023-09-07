DEFAULT = {
  gameId: null,
  playerId: null,
  numCorrectWordsGuessed: null,
  numGuessesTotal: null,
};

class GameStat {
  constructor({ gameId, playerId, numCorrectWordsGuessed, numGuessesTotal }) {
    this.gameId = gameId || DEFAULT.gameId;
    this.playerId = playerId || DEFAULT.playerId;
    this.numCorrectWordsGuessed =
      numCorrectWordsGuessed || DEFAULT.numCorrectWordsGuessed;
    this.numGuessesTotal = numGuessesTotal || DEFAULT.numGuessesTotal;
  }
}

module.exports = GameStat;
