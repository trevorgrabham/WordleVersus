import { create } from 'zustand';

const usePlayerStore = create((set) => ({
  playerId: null,
  username: '',
  email: '',
  setPlayerId: (newPlayerId) => set(() => ({ playerId: newPlayerId })),
  setUsername: (newUsername) => set(() => ({ username: newUsername })),
  setEmail: (newEmail) => set(() => ({ email: newEmail })),
  setPlayer: ({ playerId, username, email }) => {
    set((previousState) => ({
      playerId: playerId || previousState.playerId,
      username: username || previousState.username,
      email: email || previousState.email,
    }));
  },
}));

export default usePlayerStore;
