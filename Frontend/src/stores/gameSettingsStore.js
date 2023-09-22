import { create } from 'zustand';

const useGameSettingsStore = create((set) => ({
  wordleLength: undefined,
  gameType: undefined,
  roomCode: undefined,
  public: false,
  playerNumber: undefined,
  setGameType: (newType) => set(() => ({ gameType: newType })),
  setWordleLength: (newLength) => set(() => ({ wordleLength: newLength })),
  setRoomCode: (newCode) => set(() => ({ roomCode: newCode })),
  setPublic: (isPublic) => set(() => ({ public: isPublic })),
  setPlayerNumber: (playerNum) => set(() => ({ playerNumber: playerNum })),
}));

export default useGameSettingsStore;
