import { create } from 'zustand';

const useGameSettingsStore = create((set) => ({
  wordleLength: undefined,
  gameType: undefined,
  roomCode: undefined,
  setGameType: (newType) => set(() => ({ gameType: newType })),
  setWordleLength: (newLength) => set(() => ({ wordleLength: newLength })),
  setRoomCode: (newCode) => set(() => ({ roomCode: newCode })),
}));

export default useGameSettingsStore;
