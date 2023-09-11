import create from 'zustand';

const usePlayerStore = create((set) => ({
  playerId: null,
  username: '',
  email: '',
  setPlayerId: (newPlayerId) => set({ playerId: newPlayerId }),
  setUsername: (newUsername) => set({ username: newUsername }),
  setEmail: (newEmail) => set({ email: newEmail }),
}));

export default usePlayerStore;
