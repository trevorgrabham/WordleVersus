import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useGameSettingStore from '../stores/gameSettingStore';
import Guess from '../Components/Guess';
import Error from '../Components/Error';
import UsedLetter from '../Components/UsedLetter';

const emptyError = () => ({
  message: '',
  target: undefined,
});

const defaultLetters = () => {
  let letters = {};
  for (var i = 65; i < 91; ++i) {
    letters[String.fromCharCode(i)] = 0;
  }
  return letters;
};

function GamePage() {
  console.log(`Rendering GamePage component`);
  const { wordleLength } = useGameSettingStore();
  const [wordleData, setWordleData] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [wordle, setWordle] = useState(undefined);
  const [guesses, setGuesses] = useState([]);
  // letter codes: [(0, un-used), (1, used and not in word), (2, used and in word), (3, used and in right spot)]
  // Once we set a code to a value, it will never decrease, only increase
  const [usedLetters, setUsedLetters] = useState(defaultLetters());
  const [stats, setStats] = useState({
    numGuessesTotal: 0,
    numCorrectWordsGuessed: 0,
  });
  const [currentGuess, setCurrentGuess] = useState('');
  const [error, setError] = useState(emptyError());

  useEffect(async () => {
    console.log(
      `Attempting to get word list of length ${wordleLength} at /WordLists/${wordleLength}-word-list.json`,
    );
    try {
      let wordListData = await axios.get(
        `/WordLists/${wordleLength}-word-list.json`,
      );
      setWordleData(wordListData.data);
      setWordle(fetchWordle(wordListData.data));
    } catch (e) {
      console.log(`Problem fetching word list of length ${wordleLength}`);
      setError({
        message: `Unable to fetch /WordList/${wordleLength}-word-list.json`,
      });
    }
  }, [wordleLength]);

  function fetchWordle(data) {
    console.log(`Fetching a wordle from the word list data`);
    if (!data) {
      data = wordleData;
      console.log(`No data supplied to fetchWordle()`);
    }
    let index;
    if (!data.length) {
      console.error(`Our word list is empty! Unable to fetchWordle()`);
      setError({
        message: `Word list is empty`,
        target: 'global',
      });
      return;
    }
    do {
      index = Math.floor(Math.random() * data.length);
    } while (blacklist.includes(data[index]));
    let newWordle = data[index];
    console.log(`Got a wordle! ${newWordle}`);
    return newWordle;
  }

  function onGuessChange({ target: { value } }) {
    setCurrentGuess(value);
  }

  function submitGuess() {
    const playersGuess = currentGuess;
    console.log(`Guess submitted! ${playersGuess}`);
    if (!validateGuess(playersGuess)) return;
    let compareResults = compareGuess(playersGuess);
    console.log(
      `No problems with ${playersGuess}. Adding ${playersGuess} to guess list`,
    );
    setGuesses((prev) => [
      ...prev,
      { guess: playersGuess, letterCodes: compareResults.letterCodes },
    ]);
    setCurrentGuess('');
    if (compareResults.correct) return correctGuess();
    if (guesses.length >= 5) return gameOver();
  }

  function validateGuess(playersGuess) {
    console.log(
      `${playersGuess} is ${
        wordleData.includes(playersGuess) ? '' : 'not '
      }in the word list`,
    );
    if (playersGuess.length !== wordleLength) {
      setError({
        message:
          playersGuess.length > wordleLength
            ? `Guess is too long. Should be ${wordleLength} letters long.`
            : `Guess is too short. Should be ${wordleLength} letters long.`,
        target: 'guess',
      });
      return false;
    }
    if (blacklist.includes(playersGuess)) {
      setError({
        message: 'You already tried this word. Please try a different one.',
        target: 'guess',
      });
      return false;
    }
    if (!wordleData.includes(playersGuess)) {
      setError({
        message: 'Not a valid word. Please try a different word.',
        target: 'guess',
      });
      return false;
    }
    setError(emptyError());
    setStats((prev) => ({
      ...prev,
      numGuessesTotal: prev.numGuessesTotal + 1,
    }));
    return true;
  }

  function compareGuess(playersGuess) {
    console.log(`Comparing ${playersGuess} against ${wordle}`);
    let letterCodes = new Array(wordleLength).fill(1);
    // Need to create a copy of the correct wordle, so that we can remove letters from consideration once they are accounted for
    let wordleCopy = wordle.slice();
    console.log(`Finding matches now`);
    for (var i = 0; i < wordleLength; ++i) {
      if (playersGuess[i] === wordle[i]) {
        letterCodes[i] = 3;
        // We have found a match for this letter, we don't care about it anymore
        wordleCopy = wordleCopy.slice(0, i) + ' ' + wordleCopy.slice(i + 1);
      }
    }
    for (var i = wordleLength - 1; i >= 0; --i) {
      if (i >= wordleCopy.length) continue;
      if (wordleCopy[i] === ' ')
        wordleCopy = wordleCopy.slice(0, i) + wordleCopy.slice(i + 1);
    }
    console.log(`Wordle after removing matched letters: ${wordleCopy}`);
    console.log(`Finding letters that are present, but misplaced`);
    for (var i = 0; i < playersGuess.length; ++i) {
      // We have already dealt with this letter
      if (letterCodes[i] === 3) {
        console.log(
          `Skipping index ${i} because we already have a match there`,
        );
        continue;
      }
      /* DEBUG */ console.log(
        `Searching for letter ${playersGuess[i]} in ${wordleCopy}`,
      );
      let letterIndex = wordleCopy.indexOf(playersGuess[i]);
      if (letterIndex !== -1) {
        /* DEBUG */ console.log(
          `Found letter ${playersGuess[i]} at index ${letterIndex}. These should match ${playersGuess[i]} and ${wordleCopy[letterIndex]}`,
        );
        wordleCopy =
          wordleCopy.slice(0, letterIndex) + wordleCopy.slice(letterIndex + 1);
        letterCodes[i] = 2;
      }
    }
    // We are correct if every code in our letterCodes is 3. We check that the sum of the letterCodes = 3x the length
    console.log(
      `Finished comparing. Results (letter, letterCode): [${letterCodes
        .map((letterCode, index) => `(${playersGuess[index]}, ${letterCode})`)
        .join(', ')}]`,
    );
    updateUsedLetters({ letterCodes, playersGuess });
    return {
      correct:
        letterCodes.reduce((acc, curr) => acc + curr, 0) === wordleLength * 3,
      letterCodes,
    };
  }

  function updateUsedLetters({ letterCodes, playersGuess }) {
    console.log(
      `Updating with letter code: [${letterCodes.map(
        (code, index) => `(${playersGuess[index]}, ${code})`,
      )}]`,
    );
    /* DEBUG */ console.log(
      `usedLetters: {\n${Object.keys(usedLetters)
        .map((key) => `${key}: ${usedLetters[key]}`)
        .join(',\n')}}`,
    );
    let usedLettersCopy = usedLetters;
    for (var i = 0; i < playersGuess.length; ++i) {
      console.log(
        `Comparing the current code for letter ${playersGuess[i]}:${
          usedLettersCopy[playersGuess[i].toUpperCase()]
        } with the newly computed letter code ${letterCodes[i]}`,
      );
      if (letterCodes[i] > usedLettersCopy[playersGuess[i].toUpperCase()])
        usedLettersCopy[playersGuess[i].toUpperCase()] = letterCodes[i];
    }
    setUsedLetters(usedLettersCopy);
  }

  function correctGuess() {
    console.log(`Correct! The wordle was ${wordle}`);
    setBlacklist((prev) => [...prev, wordle]);
    // This is where we should check the gameSettingStore() to see what game logic to implement next
  }

  function gameOver() {
    console.log(`Game Over!`);
  }

  return (
    <div style={mainContainerStyle}>
      <div style={headerContainerStyle}>
        <div style={wordleContainerStyle}>{wordle}</div>
        <div style={usedLetterContainerStyle}>
          <div style={usedLetterGridStyle}>
            {Object.keys(usedLetters).map((key) => {
              return <UsedLetter code={usedLetters[key]}>{key}</UsedLetter>;
            })}
          </div>
        </div>
      </div>
      {error.target && <Error>{error.message}</Error>}
      <div style={guessContainerStyle}>
        {guesses.map(({ guess, letterCodes }) => {
          return <Guess letterCodes={letterCodes}>{guess}</Guess>;
        })}
      </div>
      <div style={inputContainerStyle}>
        <input
          style={inputStyle}
          name="guess"
          value={currentGuess}
          onChange={onGuessChange}
          type="text"
        />
        <button onClick={submitGuess}>Guess</button>
        <button onClick={() => setWordle(fetchWordle())}>New Wordle</button>
      </div>
    </div>
  );
}

export default GamePage;

const mainContainerStyle = {
  width: '100vw',
  height: '100vh',
  padding: '1vmin',
};

const headerContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const wordleContainerStyle = {
  flex: '5',
};

const usedLetterContainerStyle = {
  flex: '1',
};

const usedLetterGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7,1fr)',
  gridGap: '10px',
};

const guessContainerStyle = {};

const inputContainerStyle = {};

const inputStyle = {};
