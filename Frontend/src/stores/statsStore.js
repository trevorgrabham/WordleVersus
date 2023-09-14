import { create } from 'zustand';

const useStatsStore = create((set) => ({
  numGuessesTotal: 0,
  numCorrectWordsGuessed: 0,
  incNumGuessesTotal: () =>
    set((state) => ({ numGuessesTotal: state.numGuessesTotal + 1 })),
  incNumCorrectWordsGuessed: () =>
    set((state) => ({
      numCorrectWordsGuessed: state.numCorrectWordsGuessed + 1,
    })),
  resetStats: () =>
    set(() => ({ numGuessesTotal: 0, numCorrectWordsGuessed: 0 })),
}));

export default useStatsStore;
