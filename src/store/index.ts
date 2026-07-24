import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  activeNotifications: number;
  setActiveNotifications: (n: number) => void;

  selectedWorkspace: string;
  setSelectedWorkspace: (w: string) => void;

  environment: 'production' | 'staging' | 'development';
  setEnvironment: (e: 'production' | 'staging' | 'development') => void;

  realtimeEnabled: boolean;
  toggleRealtime: () => void;

  lastUpdate: Date;
  setLastUpdate: (d: Date) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  activeNotifications: 7,
  setActiveNotifications: (n) => set({ activeNotifications: n }),

  selectedWorkspace: 'Global Operations',
  setSelectedWorkspace: (w) => set({ selectedWorkspace: w }),

  environment: 'production',
  setEnvironment: (e) => set({ environment: e }),

  realtimeEnabled: true,
  toggleRealtime: () => set((state) => ({ realtimeEnabled: !state.realtimeEnabled })),

  lastUpdate: new Date(),
  setLastUpdate: (d) => set({ lastUpdate: d }),
}));
