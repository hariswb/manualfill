import React, { MouseEvent } from "react";
import "../assets/toolbar.css";
import { ISearchResult } from "./types";
import { useToolbarStore } from "./store";

const SearchResults = () => {
  const removeInput = useToolbarStore((state) => state.removeInput);
  const focusedHostInputId = useToolbarStore(
    (state) => state.focusedHostInputId
  );
  const searchTerm = useToolbarStore((state) => state.searchTerm);
  const searchResults = useToolbarStore((state) => state.searchResults);
  const fetchSearchResults = useToolbarStore(
    (state) => state.fetchSearchResults
  );
  return (
    <>
      <ul className="toolbar-search-result">
        {searchResults.map((d: ISearchResult, index: number) => (
          <SearchResult
            liId={"search-result-" + index.toString()}
            key={"search-result-" + index.toString()}
            searchTerm={searchTerm}
            searchResult={d}
            focusedHostInputId={focusedHostInputId ? focusedHostInputId : ""}
            removeInput={removeInput}
            handleSearch={fetchSearchResults}
          />
        ))}
      </ul>
    </>
  );
};

const SearchResult = (props: {
  liId: string;
  searchTerm: string;
  searchResult: ISearchResult;
  focusedHostInputId: string;
  removeInput: (labelContent: string) => Promise<boolean>;
  handleSearch: (searchTerm: string) => void;
}) => {
  function handleInsertToHostInput(e: MouseEvent<HTMLButtonElement>) {
    if (!props.focusedHostInputId) return;

    const focusedHostInput = document.getElementById(props.focusedHostInputId);

    if (
      !(
        focusedHostInput &&
        (focusedHostInput instanceof HTMLInputElement ||
          focusedHostInput instanceof HTMLTextAreaElement)
      )
    )
      return;

    focusedHostInput.value = props.searchResult.inputContent;

    focusedHostInput.dispatchEvent(new Event("input", { bubbles: true }));
    focusedHostInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  async function handleRemove(e: MouseEvent<HTMLSpanElement>) {
    const result = await props.removeInput(props.searchResult.labelContent);
    if (!result) return;
    props.handleSearch(props.searchTerm);
  }

  return (
    <li id={props.liId}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <p className="text label-text">{props.searchResult.labelContent}</p>
      <p className="text input-text">{props.searchResult.inputContent}</p>
      <div className="action-buttons">
        <button
          className="toolbar-search-result-insert"
          onClick={(e) => handleInsertToHostInput(e)}
        >
          Insert
        </button>

        <span
          className="material-symbols-outlined toolbar-search-result-remove"
          onClick={(e) => handleRemove(e)}
        >
          delete
        </span>
      </div>
    </li>
  );
};

export default SearchResults;
