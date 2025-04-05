
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DocumentData {
  category: string;
  formData: Record<string, any>;
}

interface DocumentState {
  documentData: DocumentData;
  setDocumentCategory: (category: string) => void;
  setFormData: (data: Record<string, any>) => void;
  resetData: () => void;
}

const initialState: DocumentData = {
  category: "",
  formData: {}
};

export const useDocumentState = create<DocumentState>()(
  persist(
    (set) => ({
      documentData: initialState,
      setDocumentCategory: (category: string) =>
        set((state) => ({
          documentData: { ...state.documentData, category },
        })),
      setFormData: (formData: Record<string, any>) =>
        set((state) => ({
          documentData: { ...state.documentData, formData },
        })),
      resetData: () => set({ documentData: initialState }),
    }),
    {
      name: "document-storage",
    }
  )
);
