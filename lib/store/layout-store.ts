import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LayoutTemplate {
  id: string;
  name: string;
  sections: {
    id: string;
    type: 'title' | 'description' | 'pricing' | 'gallery' | 'specs' | 'reviews';
    visible: boolean;
    order: number;
  }[];
}

interface LayoutStore {
  templates: LayoutTemplate[];
  activeTemplate: string | null;
  addTemplate: (template: Omit<LayoutTemplate, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<LayoutTemplate>) => void;
  deleteTemplate: (id: string) => void;
  setActiveTemplate: (id: string | null) => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      templates: [],
      activeTemplate: null,

      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, { ...template, id: crypto.randomUUID() }]
      })),

      updateTemplate: (id, template) => set((state) => ({
        templates: state.templates.map((t) =>
          t.id === id ? { ...t, ...template } : t
        )
      })),

      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
        activeTemplate: state.activeTemplate === id ? null : state.activeTemplate
      })),

      setActiveTemplate: (id) => set({ activeTemplate: id })
    }),
    {
      name: 'store-layouts',
      skipHydration: true,
    }
  )
);