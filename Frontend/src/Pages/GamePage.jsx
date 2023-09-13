import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useGameSettingStore from '../stores/gameSettingStore';
import Guess from '../Components/Guess';

function GamePage() {
  const { wordleLength, gameType, setWordleLength } = useGameSettingStore();
  const [blacklist, setBlacklist] = useState([]);
  const [wordleData, setWordleData] = useState([]);
  const [wordle, setWordle] = useState(undefined);
  const [guesses, setGuesses] = useState([]);
  const [totalNumGuesses, setTotalNumGuesses] = useState(0);
  const [correctWordles, setCorrectWordles] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [validGuess, setValidGuess] = useState(true);
  const [warnings, setWarnings] = useState([]);

  useEffect(async () => {
    console.log('Rendering GamePage');
    try {
      let wordListData = await axios.get(
        '/WordLists/' + wordleLength.toString() + '-word-list.json',
      );
      setWordleData(wordListData.data);
      setWordle(fetchWordle(wordListData.data));
    } catch (e) {
      console.error(`Problem fetching word list of length ${wordleLength}`);
    }
  }, [wordleLength]);

  function fetchWordle(data) {
    if (!data) data = wordleData;
    let index;
    console.log(`We have ${data.length} words to choose from`);
    do {
      index = Math.floor(Math.random() * data.length);
    } while (blacklist.includes(data[index]));
    console.log(`Using index ${index}`);
    let newWordle = data[index];
    console.log(`Got a wordle! ${newWordle}`);
    return newWordle;
  }

  function onGuessChange(event) {
    let guess = event.target.value;
    setCurrentGuess(guess);
  }

  function submitGuess() {
    if (!validateGuess()) return;
    let compareResults = compareGuess();
    if (compareResults.correct) return correctGuess();
    if (guesses.length >= 5) return gameOver();
    setGuesses((prev) => [
      ...prev,
      { guess: currentGuess, letterCodes: compareResults.letterCodes },
    ]);
    setCurrentGuess('');
  }

  function validateGuess() {
    console.log(
      `${currentGuess} is ${
        wordleData.includes(currentGuess) ? '' : 'not'
      } in the word list`,
    );
    if (currentGuess.length !== wordleLength) {
      setValidGuess(false);
      setWarnings([
        currentGuess.length > wordleLength
          ? `Guess is too long. Should be ${wordleLength} letters long.`
          : `Guess is too short. Should be ${wordleLength} letters long.`,
      ]);
      return false;
    }
    if (blacklist.includes(currentGuess)) {
      setValidGuess(false);
      setWarnings(['You already tried this word. Please try a different one.']);
      return false;
    }
    if (!wordleData.includes(currentGuess)) {
      setValidGuess(false);
      setWarnings(['Not a valid word. Please try a different word.']);
      return false;
    }
    setValidGuess(true);
    setWarnings([]);
    setTotalNumGuesses((prev) => prev + 1);
    return true;
  }

  /**
   * @returns {Object} - correct: whether the correct wordle was guessed
   *                   - letters: array for each letter whether it was in the correct spot, wrong spot, or not contained in the word
   */
  function compareGuess() {
    let letterCodes = new Array(wordleLength).fill(1);
    let wordleCopy = wordle.slice();
    console.log(`Finding matches now`);
    for (var i = 0; i < wordleLength; ++i) {
      if (currentGuess[i] === wordle[i]) {
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
    console.log(
      `Wordle copy after removing matches: ${wordleCopy}\nFinding wrong places now`,
    );
    for (var i = 0; i < wordleLength; ++i) {
      // We have already dealt with this letter
      if (letterCodes[i] === 3) {
        console.log(
          `Skipping index ${i} because we already have a match there`,
        );
        continue;
      }
      let letterIndex = wordleCopy.indexOf(currentGuess[i]);
      if (letterIndex !== -1) {
        letterCodes[i] = 2;
        wordleCopy =
          wordleCopy.slice(0, letterIndex) + wordleCopy.slice(letterIndex + 1);
        console.log(
          `Removed ${currentGuess[i]} from wordle, leaving ${wordleCopy} to still look over`,
        );
      }
    }
    return {
      correct:
        letterCodes.reduce((acc, curr) => acc + curr, 0) === wordleLength * 3,
      letterCodes,
    };
    // return {
    //   correct: false,
    //   letters: [1, 2, 0, 1, 0],
    // };
  }

  function correctGuess() {
    setBlacklist(() => [...blacklist, newWordle]);
  }

  function gameOver() {
    setWordle(`Game Over`);
    setGuesses([]);
    setCurrentGuess('');
    setBlacklist([]);
  }

  return (
    <div>
      <h1>{wordle}</h1>
      <h3>Warnings</h3>
      {warnings.map((warning, warningIndex) => {
        return <h3 key={warningIndex}>{warning}</h3>;
      })}
      <h3>Guesses</h3>
      <ul>
        {guesses.map(({ guess, letterCodes }, guessIndex) => {
          return (
            <Guess key={guessIndex} word={guess} letterCodes={letterCodes} />
          );
        })}
      </ul>

      <hr />
      <label>
        Guess:
        <input
          type="text"
          name="guess"
          value={currentGuess}
          onChange={onGuessChange}
        />
      </label>
      <button onClick={submitGuess}>Guess</button>
      <button onClick={() => setWordle(fetchWordle())}>New Word</button>
    </div>
  );
}

export default GamePage;
