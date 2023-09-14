import { create } from 'zustand';
import { compareGuess } from '../gameLogic';

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

const useGameDataStore = create((set) => ({
  wordle: '',
  blacklist: [],
  wordList: [],
  gameState: '',
  guesses: [],
  usedLetters: defaultLetters(),
  error: emptyError(),
  setWordle: (newWordle) => set(() => ({ wordle: newWordle })),
  addToBlacklist: (word) =>
    set((state) => ({ blacklist: [...state.blacklist, word] })),
  setWordList: (newList) => set(() => ({ wordList: newList })),
  setGameState: (newState) => set(() => ({ gameState: newState })),
  addGuess: (newGuess) => {
    set((state) => {
      let numGuesses = state.guesses.length + 1;
      state.addToBlacklist(newGuess);
      let compareResults = compareGuess({
        playersGuess: newGuess,
        wordle: state.wordle,
        numGuesses,
        updateUsedLetters: state.updateLetterCode,
      });
      state.setGameState(compareResults.gameState);
      return {
        guesses: [
          ...state.guesses,
          { guess: newGuess, letterCodes: compareResults.letterCodes },
        ],
      };
    });
  },
  clearGuesses: () => set(() => ({ guesses: [] })),
  updateLetterCode: ({ key, newCode }) =>
    set((state) => ({
      usedLetters:
        newCode > state.usedLetters[key.toUpperCase()]
          ? { ...state.usedLetters, [key.toUpperCase()]: newCode }
          : state.usedLetters,
    })),
  setError: (e) => set(() => ({ error: e })),
  clearGameData: () =>
    set(() => ({
      wordle: '',
      blacklist: [],
      gameState: '',
      guesses: [],
      usedLetters: defaultLetters(),
      error: emptyError(),
    })),
}));

export default useGameDataStore;
