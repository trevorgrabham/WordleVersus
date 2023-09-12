import { create } from 'zustand';

const useGameSettingStore = create((set) => ({
  wordleLength: undefined,
  gameType: undefined,
  setGameType: (newGameType) => set({ gameType: newGameType }),
  setWordleLength: (newWordleLength) => set({ wordleLength: newWordleLength }),
}));

export default useGameSettingStore;
