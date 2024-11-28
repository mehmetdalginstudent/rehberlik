import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  login: (username: string, password: string) => {
    // Basit string karşılaştırması yapıyoruz
    if (username === 'Aras' && password === 'Arya48++') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),
}));