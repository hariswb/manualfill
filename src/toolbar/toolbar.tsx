import React, {
  useState,
  useEffect,
  MouseEvent,
  FormEvent,
  useRef,
} from "react";
import "../assets/toolbar.css";
import SearchResults from "./searchResult";
import { useToolbarStore } from "./store";

interface IToolbarStyle {
  [key: string]: string;
}

const defaultToolbarDisplayStyle: IToolbarStyle = {
  opacity: "0",
  pointerEvents: "none",
};

const defaultToolbarPosStyle: IToolbarStyle = {
  top: "0px",
  left: "0px",
};

export default function Toolbar() {
  // Local State
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [toolbarDisplayStyle, setToolbarDisplayStyle] = useState<IToolbarStyle>(
    defaultToolbarDisplayStyle
  );
  const [toolbarPosStyle, setToolbarPosStyle] = useState<IToolbarStyle>(
    defaultToolbarPosStyle
  );

  // Global state from zustand
  const focusedHostInputId = useToolbarStore(
    (state) => state.focusedHostInputId
  );

  const savedInput = useToolbarStore((state) => state.savedInput);
  const saveInput = useToolbarStore((state) => state.saveInput);
  const cleanupSavedInput = useToolbarStore((state) => state.cleanupSavedInput);

  const removedInput = useToolbarStore((state) => state.removedInput);
  const cleanupRemovedInput = useToolbarStore(
    (state) => state.cleanupRemovedInput
  );

  const searchResults = useToolbarStore((state) => state.searchResults);
  const fetchSearchResults = useToolbarStore(
    (state) => state.fetchSearchResults
  );

  // Effects
  useEffect(() => {
    const focusedHostInput = getFocusedHostInput(focusedHostInputId);
    const labelText = getLabelText(focusedHostInput);

    fetchSearchResults(labelText);
  }, [focusedHostInputId, savedInput, removedInput]);

  useEffect(() => {
    const focusedHostInput = getFocusedHostInput(focusedHostInputId);

    if (!focusedHostInput) return;

    const inputViewPortOffset = focusedHostInput.getBoundingClientRect();

    const toolbarOffsetHeight = toolbarRef.current
      ? toolbarRef.current.offsetHeight
      : 0;

    const overflownToolbarPx =
      inputViewPortOffset.top + toolbarOffsetHeight - window.innerHeight;

    // Toolbar position relative to host document
    const toolbarPos = inputViewPortOffset.top + window.scrollY;

    const top =
      Math.min(toolbarPos - overflownToolbarPx - 16, toolbarPos).toString() +
      "px";
    const left =
      (
        inputViewPortOffset.left +
        inputViewPortOffset.width +
        window.scrollX +
        16
      ).toString() + "px";

    setToolbarPosStyle({ top: top, left: left });
  }, [searchResults]);

  useEffect(() => {
    if (focusedHostInputId === null) {
      setToolbarDisplayStyle(defaultToolbarDisplayStyle);
      return;
    }
    const focusedHostInput = getFocusedHostInput(focusedHostInputId);

    if (focusedHostInput) {
      setToolbarDisplayStyle({ opacity: "1", pointerEvents: "auto" });
      return;
    }

    setToolbarDisplayStyle(defaultToolbarDisplayStyle);
  }, [toolbarPosStyle, focusedHostInputId]);

  useEffect(() => {
    if (savedInput) {
      cleanupSavedInput();
    }
    if (removedInput) {
      cleanupRemovedInput();
    }
  }, [savedInput, removedInput]);

  function handleSaveInput(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const focusedHostInput = getFocusedHostInput(focusedHostInputId);
    const labelContent = getLabelText(focusedHostInput);
    const inputContent = focusedHostInput?.value;

    if (!inputContent || !labelContent) return;
    saveInput(labelContent, inputContent);
  }

  function handleSearchFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (e.target && e.target instanceof HTMLFormElement) {
      const searchTerm = e.target["toolbar-search"].value;
      fetchSearchResults(searchTerm);
    }
  }

  return (
    <div
      id="toolbar"
      style={{ ...toolbarDisplayStyle, ...toolbarPosStyle }}
      ref={toolbarRef}
    >
      <button id="toolbar-save-button" onClick={(e) => handleSaveInput(e)}>
        Save Input
      </button>
      <form
        id="toolbar-search-form"
        onSubmit={(e) => handleSearchFormSubmit(e)}
      >
        <input
          id="toolbar-search-input"
          type="search"
          name="toolbar-search"
          placeholder="Search saved input..."
        ></input>
        <button id="toolbar-search-button" type="submit">
          Search
        </button>
      </form>
      <SearchResults />
    </div>
  );
}

function getFocusedHostInput(
  focusedHostInputId: string | null
): HTMLInputElement | HTMLTextAreaElement | null {
  if (!focusedHostInputId) {
    return null;
  }

  const focusedHostInput = document.getElementById(focusedHostInputId);
  if (
    !(
      focusedHostInput instanceof HTMLInputElement ||
      focusedHostInput instanceof HTMLTextAreaElement
    )
  ) {
    return null;
  }

  return focusedHostInput;
}

function getLabelText(
  input: HTMLInputElement | HTMLTextAreaElement | null
): string {
  let label: Element | null = null;

  if (!input) return "";

  // First method
  const result = document.querySelector(`label[for="${input.id}"]`);
  if (result) {
    label = result;
  }

  // Second method
  if (!label && input.parentNode) {
    const parentNodeChildren = input.parentNode.children;
    for (let i = 0; i < parentNodeChildren.length; i++) {
      if (parentNodeChildren[i].tagName.toLowerCase() === "label") {
        label = parentNodeChildren[i];
        break;
      }
    }
  }

  if (label && label.textContent && typeof label.textContent === "string")
    return label.textContent;

  return "";
}
