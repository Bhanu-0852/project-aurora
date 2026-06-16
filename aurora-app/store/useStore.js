import { create } from 'zustand';

const useAppStore = create((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null }),

  theme: 'system',
  setTheme: (theme) => set({ theme }),

  hydration: null,
  setHydration: (hydration) => set({ hydration }),

  sleep: null,
  setSleep: (sleep) => set({ sleep }),

  habits: [],
  setHabits: (habits) => set({ habits }),

  nutrition: null,
  setNutrition: (nutrition) => set({ nutrition }),

  dashboard: null,
  setDashboard: (dashboard) => set({ dashboard }),

  insight: '',
  setInsight: (insight) => set({ insight }),
}));

export default useAppStore;