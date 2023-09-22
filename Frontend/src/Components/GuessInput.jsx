import React, { useRef } from 'react';
import useStatsStore from '../stores/statsStore';
import useGameDataStore from '../stores/gameDataStore';
import useErrorStore from '../stores/errorStore';
import Error from './Error';

const GuessInput = React.memo(() => {
  console.log(`Rendering GuessInput component`);
  const [getErrorMessage, clearErrors, addError] = useErrorStore((state) => [
    state.getErrorMessage,
    state.clearErrors,
    state.addError,
  ]);
  const [blacklist, wordList, addGuess] = useGameDataStore((state) => [
    state.blacklist,
    state.wordList,
    state.addGuess,
  ]);
  const guessRef = useRef('');
  const incNumGuessesTotal = useStatsStore((state) => state.incNumGuessesTotal);

  return (
    <div style={mainContainerStyle}>
      {getErrorMessage({ target: 'guessInputTarget', component: 'global' }) && (
        <Error>
          {getErrorMessage({ target: 'guessInputTarget', component: 'global' })}
        </Error>
      )}
      <div style={inputContainerStyle}>
        <input style={inputStyle} type="text" name="guess" ref={guessRef} />
        {getErrorMessage({
          target: 'guessInputTarget',
          component: 'input',
        }) && (
          <Error fontSize="12">
            {getErrorMessage({
              target: 'guessInputTarget',
              component: 'input',
            })}
          </Error>
        )}
        <button
          onClick={() => {
            clearErrors({ target: 'guessInputTarget', component: 'input' });
            let submitResponse = submitGuess({
              playersGuess: guessRef.current.value,
              addGuess,
              wordList,
              blacklist,
            });
            if (submitResponse.error) {
              addError({
                message: submitResponse.message,
                target: 'guessInputTarget',
                component: 'input',
              });
              return;
            }
            incNumGuessesTotal();
            guessRef.current.value = '';
          }}
        >
          Guess
        </button>
      </div>
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

const mainContainerStyle = {};

const inputContainerStyle = {};

const inputStyle = {};
