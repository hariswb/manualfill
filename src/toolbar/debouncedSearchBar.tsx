import React, { useState, useEffect, ChangeEvent } from "react";
import { useToolbarStore } from "./store";
import { getFocusedHostInput, getLabelText } from "./common";

const DebouncedSearchBar = () => {
  const [inputValue, setInputValue] = useState("");

  const focusedHostInputId = useToolbarStore(
    (state) => state.focusedHostInputId
  );

  const searchTerm = useToolbarStore((state) => state.searchTerm);

  const updateSearchTerm = useToolbarStore((state) => state.updateSearchTerm);

  // Update input value immediately for responsive UI
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Debounce the update of the search value
  useEffect(() => {
    if (
      inputValue === "" &&
      getLabelText(getFocusedHostInput(focusedHostInputId))
    ) {
      updateSearchTerm(getLabelText(getFocusedHostInput(focusedHostInputId)));
      return;
    }

    const timer = setTimeout(() => {
      if (searchTerm.trim() === inputValue.trim()) return;
      updateSearchTerm(inputValue);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  useEffect(() => {
    setInputValue("");
  }, [focusedHostInputId]);

  return (
    <div className="debounced-search-bar">
      <div className="search-bar">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <span className="material-symbols-outlined">search</span>
        <input
          className="search-bar"
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default DebouncedSearchBar;
