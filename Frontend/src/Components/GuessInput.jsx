import React, { useState } from 'react';
import useStatsStore from '../stores/statsStore';
import useGameDataStore from '../stores/gameDataStore';

const GuessInput = React.memo(() => {
  console.log(`Rendering GuessInput component`);
  const [blacklist, wordList, addGuess, setError] = useGameDataStore(
    (state) => [
      state.blacklist,
      state.wordList,
      state.addGuess,
      state.setError,
    ],
  );
  console.log(
    `GameStatStore values: {\nblacklist: [${blacklist.join(
      ', ',
    )}]\nwordList:[${wordList.slice(0, 100).join(', ')}]\n}`,
  );
  const incNumGuessesTotal = useStatsStore((state) => state.incNumGuessesTotal);

  const [currentGuess, setCurrentGuess] = useState('');

  return (
    <div style={inputContainerStyle}>
      <input
        style={inputStyle}
        name="guess"
        value={currentGuess}
        onChange={({ target: { value } }) => setCurrentGuess(value)}
        type="text"
      />
      <button
        onClick={() => {
          let submitResponse = submitGuess({
            playersGuess: currentGuess,
            addGuess,
            wordList,
            blacklist,
          });
          if (submitResponse.error)
            return setError({
              message: submitResponse.message,
              target: 'guess',
            });
          incNumGuessesTotal();
          setCurrentGuess('');
        }}
      >
        Guess
      </button>
    </div>
  );
});

export default GuessInput;

function submitGuess({ playersGuess, addGuess, blacklist, wordList }) {
  console.log(`Guess submitted! ${playersGuess}`);
  let validateResults = validateGuess({ playersGuess, blacklist, wordList });
  if (validateResults.error) return validateResults;
  addGuess(playersGuess);
  return { error: false };
}

function validateGuess({ playersGuess, blacklist, wordList }) {
  console.log(
    `${playersGuess} is ${
      wordList.includes(playersGuess) ? '' : 'not '
    }in the word list`,
  );
  let wordLength = wordList[0].length;
  if (playersGuess.length !== wordLength) {
    return {
      error: true,
      message:
        playersGuess.length > wordLength
          ? `Guess is too long. Should be ${wordLength} letters long.`
          : `Guess is too short. Should be ${wordLength} letters long.`,
    };
  }
  if (blacklist.includes(playersGuess)) {
    return {
      error: true,
      message: 'You already tried this word. Please try a different one.',
    };
  }
  if (!wordList.includes(playersGuess)) {
    return {
      error: true,
      message: 'Not a valid word. Please try a different word.',
    };
  }
  return {
    error: false,
  };
}

const inputContainerStyle = {};

const inputStyle = {};
