import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { colord } from 'colord';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

interface ThemeStore {
  colors: ThemeColors;
  setColor: (key: keyof ThemeColors, value: string) => void;
  resetColors: () => void;
  generatePalette: (baseColor: string) => void;
}

const defaultColors: ThemeColors = {
  primary: '#6366f1',
  secondary: '#4f46e5',
  accent: '#8b5cf6',
  background: '#000000',
  text: '#ffffff',
  muted: '#6b7280'
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      colors: defaultColors,
      
      setColor: (key, value) => 
        set((state) => ({
          colors: { ...state.colors, [key]: value }
        })),
      
      resetColors: () => 
        set({ colors: defaultColors }),
      
      generatePalette: (baseColor) => {
        const color = colord(baseColor);
        
        set({
          colors: {
            primary: baseColor,
            secondary: color.darken(0.1).toHex(),
            accent: color.rotate(30).toHex(),
            background: '#000000',
            text: '#ffffff',
            muted: '#6b7280'
          }
        });
      }
    }),
    {
      name: 'store-theme',
      skipHydration: true,
    }
  )
);