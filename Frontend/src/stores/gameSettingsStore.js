import { create } from 'zustand';

const useGameSettingsStore = create((set) => ({
  wordleLength: undefined,
  gameType: undefined,
  setGameType: (newType) => set(() => ({ gameType: newType })),
  setWordleLength: (newLength) => set(() => ({ wordleLength: newLength })),
}));

export default useGameSettingsStore;
