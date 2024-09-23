import React, { MouseEvent } from "react";
import "../assets/toolbar.css";
import { ISearchResult } from "./types";
import { useToolbarStore } from "./store";

const SearchResult = (
  liId: string,
  searchResult: ISearchResult,
  focusedHostInputId: string,
  removeInput: (labelContent: string) => void
) => {
  function handleFillToHostInput(e: MouseEvent<HTMLButtonElement>) {
    if (!focusedHostInputId) return;

    const focusedHostInput = document.getElementById(focusedHostInputId);

    if (
      !(
        focusedHostInput &&
        (focusedHostInput instanceof HTMLInputElement ||
          focusedHostInput instanceof HTMLTextAreaElement)
      )
    )
      return;

    focusedHostInput.value = searchResult.inputContent;

    focusedHostInput.dispatchEvent(new Event("input", { bubbles: true }));
    focusedHostInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function handleRemove(e: MouseEvent<HTMLButtonElement>) {
    removeInput(searchResult.labelContent);
  }

  return (
    <li id={liId} key={liId}>
      <p className="label-text">{searchResult.labelContent}</p>
      <p className="input-text">{searchResult.inputContent}</p>
      <div className="action-buttons">
        <button
          className="toolbar-search-result-fill"
          onClick={(e) => handleFillToHostInput(e)}
        >
          Fill in form
        </button>
        <button
          className="toolbar-search-result-remove"
          onClick={(e) => handleRemove(e)}
        >
          Remove
        </button>
      </div>
    </li>
  );
};

const SearchResults = () => {
  const removeInput = useToolbarStore((state) => state.removeInput);
  const focusedHostInputId = useToolbarStore(
    (state) => state.focusedHostInputId
  );
  const searchResults = useToolbarStore((state) => state.searchResults);
  return (
    <>
      <ul id="toolbar-search-result">
        {searchResults.map((d: ISearchResult, index: number) =>
          SearchResult(
            "search-result-" + index.toString(),
            d,
            focusedHostInputId ? focusedHostInputId : "",
            removeInput
          )
        )}
      </ul>
    </>
  );
};

export default SearchResults;
