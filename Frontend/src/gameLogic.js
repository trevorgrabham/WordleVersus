import axios from 'axios';

export async function getWordList(wordleLength) {
  try {
    let wordList = await axios.get(`/WordLists/${wordleLength}-word-list.json`);
    return {
      error: false,
      data: wordList.data,
    };
  } catch (e) {
    return {
      error: true,
      message: `Unable to fetch /WordList/${wordleLength}-word-list.json`,
    };
  }
}

export function fetchWordle({ data, blacklist }) {
  if (!data) {
    return {
      error: true,
      message: `data not provided`,
    };
  }
  if (!blacklist)
    return {
      error: true,
      message: `blacklist not provided`,
    };
  if (!data.length) {
    return {
      error: true,
      message: `data is empty`,
    };
  }
  let index;
  let iterations = 0;
  do {
    ++iterations;
    index = Math.floor(Math.random() * data.length);
  } while (blacklist.includes(data[index]) && iterations <= data.length);
  return { error: false, data: data[index] };
}

export function compareGuess({
  playersGuess,
  wordle,
  updateUsedLetters,
  numGuesses,
}) {
  console.log(`Comparing ${playersGuess} against ${wordle}`);
  let wordleLength = wordle.length;
  let letterCodes = new Array(wordleLength).fill(1);
  // Need to create a copy of the correct wordle, so that we can remove letters from consideration once they are accounted for
  console.log(`Finding matches now`);
  for (var i = 0; i < wordleLength; ++i) {
    if (playersGuess[i] === wordle[i]) {
      letterCodes[i] = 3;
      // We have found a match for this letter, we don't care about it anymore
      wordle = wordle.slice(0, i) + ' ' + wordle.slice(i + 1);
    }
  }
  for (var i = wordleLength - 1; i >= 0; --i) {
    if (i >= wordle.length) continue;
    if (wordle[i] === ' ') wordle = wordle.slice(0, i) + wordle.slice(i + 1);
  }
  console.log(`Wordle after removing matched letters: ${wordle}`);
  console.log(`Finding letters that are present, but misplaced`);
  for (var i = 0; i < playersGuess.length; ++i) {
    // We have already dealt with this letter
    if (letterCodes[i] === 3) {
      console.log(`Skipping index ${i} because we already have a match there`);
      continue;
    }
    let letterIndex = wordle.indexOf(playersGuess[i]);
    if (letterIndex !== -1) {
      wordle = wordle.slice(0, letterIndex) + wordle.slice(letterIndex + 1);
      letterCodes[i] = 2;
    }
  }
  // We are correct if every code in our letterCodes is 3. We check that the sum of the letterCodes = 3x the length
  console.log(
    `Finished comparing. Results (letter, letterCode): [${letterCodes
      .map((letterCode, index) => `(${playersGuess[index]}, ${letterCode})`)
      .join(', ')}]`,
  );
  for (var i = 0; i < letterCodes.length; ++i) {
    updateUsedLetters({ key: playersGuess[i], newCode: letterCodes[i] });
  }
  if (letterCodes.reduce((acc, curr) => acc + curr, 0) === wordleLength * 3)
    return {
      gameState: 'Game Won!',
      letterCodes,
    };
  if (numGuesses >= 6) return { gameState: 'Game over', letterCodes };
  return {
    gameState: 'In Progress',
    letterCodes,
  };
}
