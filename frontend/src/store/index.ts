import { create } from 'zustand';
import { Job, Application, User } from '../types';

interface Store {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useStore = create<Store>((set) => {
  
  const storedUser = localStorage.getItem('currentUser');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    isDarkMode: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

    currentUser: parsedUser,
    setCurrentUser: (user) => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
      set({ currentUser: user });
    },
  };
});
