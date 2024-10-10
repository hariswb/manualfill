import React, { useState, useEffect, MouseEvent } from "react";
import { useToolbarStore } from "./store";
import { getLabelText, getFocusedHostInput } from "./common";

interface IPos {
  x: number;
  y: number;
}

export default function Pin() {
  // Local State

  const [pinDisplay, setPinDisplay] = useState<boolean>(false);
  const [pinPos, setPinPos] = useState<IPos>({ x: 0, y: 0 });

  // Global state from zustand
  const focusedHostInputId = useToolbarStore(
    (state) => state.focusedHostInputId
  );
  const saveInput = useToolbarStore((state) => state.saveInput);
  const searchTerm = useToolbarStore((state) => state.searchTerm);

  const fetchSearchResults = useToolbarStore(
    (state) => state.fetchSearchResults
  );

  useEffect(() => {
    const focusedHostInput = getFocusedHostInput(focusedHostInputId);

    if (!focusedHostInput) {
      setPinDisplay(false);
      return;
    }

    const inputViewPortOffset = focusedHostInput.getBoundingClientRect();

    // pin position relative to host document
    const margin = 16;

    const top = inputViewPortOffset.top + window.scrollY;

    const left =
      inputViewPortOffset.left +
      inputViewPortOffset.width +
      window.scrollX +
      margin;

    setPinPos({ x: left, y: top });
    setPinDisplay(true);
  }, [focusedHostInputId]);

  async function handleSaveInput(event: MouseEvent<HTMLElement>) {
    event.preventDefault();

    const focusedHostInput = getFocusedHostInput(focusedHostInputId);
    const labelContent = getLabelText(focusedHostInput);
    const inputContent = focusedHostInput?.value;

    if (!inputContent || !labelContent) return;
    const isSaved = await saveInput(labelContent, inputContent)
    if (!isSaved) return;
    fetchSearchResults(searchTerm);
  }

  return (
    <div
      className="pin prevent-select"
      style={{
        left: `${pinPos.x}px`,
        top: `${pinPos.y}px`,
        display: pinDisplay ? "block" : "none",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      <div className="save-button" onClick={(e) => handleSaveInput(e)}>
        <span className="material-symbols-outlined">bookmark</span>
      </div>
    </div>
  );
}
