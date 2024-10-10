import { create } from "zustand";
import { ISearchResult } from "./types";

type StateToolbar = {
  isDisplayed: boolean;
  focusedHostInputId: string | null;
  searchTerm: string;
  searchResults: ISearchResult[];
};

type ActionToolbar = {
  updateFocusedHostInputId: (
    focusedHostInputId: StateToolbar["focusedHostInputId"]
  ) => void;
  updateSearchTerm: (searchTerm: string) => void;
  fetchSearchResults: (searchTerm: string) => void;
  saveInput: (labelContent: string, inputContent: string) => Promise<boolean>;
  removeInput: (labelContent: string) => Promise<boolean>;
  updateIsDisplayed: (isDisplayed: boolean) => void;
};

export const useToolbarStore = create<StateToolbar & ActionToolbar>((set) => ({
  isDisplayed: false,
  updateIsDisplayed: (isDisplayed) => set({ isDisplayed: isDisplayed }),
  focusedHostInputId: null,
  savedInput: null,
  removedInput: null,
  searchTerm: "",
  searchResults: [],
  updateFocusedHostInputId: (id) => set(() => ({ focusedHostInputId: id })),
  updateSearchTerm: (searchTerm) => {
    set({ searchTerm: searchTerm });
  },
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
      return true;
    }

    return false;
  },
  removeInput: async (labelContent) => {
    const deleted = await chrome.runtime.sendMessage({
      ops: "DELETE",
      label: labelContent,
    });

    if (deleted && deleted.data) {
      return true;
    }
    return false;
  },
}));
