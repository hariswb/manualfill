import { create } from "zustand";
import { ISearchResult } from "./types";

type StateToolbar = {
  focusedHostInputId: string | null;
  savedInput: string | null;
  removedInput: string | null;
  searchResults: ISearchResult[];
};

type ActionToolbar = {
  updateFocusedHostInputId: (
    focusedHostInputId: StateToolbar["focusedHostInputId"]
  ) => void;
  fetchSearchResults: (searchTerm: string) => void;
  saveInput: (labelContent: string, inputContent: string) => void;
  cleanupSavedInput: ()=> void;
  removeInput: (labelContent: string) => void;
  cleanupRemovedInput: ()=> void;
};

export const useToolbarStore = create<StateToolbar & ActionToolbar>((set) => ({
  focusedHostInputId: null,
  savedInput: null,
  removedInput: null,
  searchResults: [],
  updateFocusedHostInputId: (id) => set(() => ({ focusedHostInputId: id })),
  fetchSearchResults: async (searchTerm) => {
    const searchResults = await chrome.runtime.sendMessage({
      ops: "SEARCH",
      label: searchTerm,
    });

    if (searchResults.ops === "SEARCH" && searchResults.data) {
      return set({
        searchResults: searchResults.data.map(
          (d: ISearchResult): ISearchResult => ({
            inputContent: d.inputContent,
            labelContent: d.labelContent,
          })
        ),
      });
    }
    return set({ searchResults: [] });
  },
  saveInput: async (labelContent, inputContent) => {
    const saved = await chrome.runtime.sendMessage({
      ops: "UPDATE",
      label: labelContent,
      input: inputContent,
    });

    if (saved && saved.data && saved.data) {
      return set({ savedInput: saved.data });
    }

    return set({ savedInput: null });
  },
  cleanupSavedInput: ()=>set(()=>({savedInput:null})),
  removeInput: async (labelContent) => {
    const deleted = await chrome.runtime.sendMessage({
      ops: "DELETE",
      label: labelContent,
    });

    if (deleted && deleted.data) {
      return set({ removedInput: deleted.data });
    }
    return set({ removedInput: null });
  },
  cleanupRemovedInput: ()=>set(()=>({removedInput:null})),
}));
