import React, {
  useState,
  useEffect,
  MouseEvent,
  useRef,
  ReactSVGElement,
  ReactElement,
} from "react";
import SearchResults from "./searchResult";
import DebouncedSearchBar from "./debouncedSearchBar";
import { useToolbarStore } from "./store";
import { getLabelText, getFocusedHostInput } from "./common";
import Logo from "./logo";

interface IPos {
  x: number;
  y: number;
}

export default function Toolbar() {
  // Local State
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState<IPos>({ x: 1000, y: 300 });

  const focusedHostInputId = useToolbarStore(
    (state) => state.focusedHostInputId
  );
  const updateIsDisplayed = useToolbarStore((state) => state.updateIsDisplayed);
  const searchTerm = useToolbarStore((state) => state.searchTerm);
  const updateSearchTerm = useToolbarStore((state) => state.updateSearchTerm);
  const fetchSearchResults = useToolbarStore(
    (state) => state.fetchSearchResults
  );

  // Effects
  useEffect(() => {
    const focusedHostInput = getFocusedHostInput(focusedHostInputId);
    const labelText = getLabelText(focusedHostInput);

    updateSearchTerm(labelText);
  }, [focusedHostInputId]);

  useEffect(() => {
    fetchSearchResults(searchTerm);
  }, [searchTerm]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPos({ x: newX, y: newY });
  };

  return (
    <div
      className="toolbar"
      style={{ top: `${pos.y}px`, left: `${pos.x}px` }}
      ref={toolbarRef}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div
        className="header"
        onMouseDown={(e) => {
          setDragStart({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
          });
          setIsDragging(true);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={(e) => handleMouseMove(e)}
      >
        <div className="logo-actions">
          <Logo />
          <span
            className="close material-symbols-outlined"
            onClick={() => {
              updateIsDisplayed(false);
            }}
          >
            keyboard_arrow_down
          </span>
        </div>
      </div>
      <DebouncedSearchBar />
      <SearchResults />
      <div className="footer"></div>
    </div>
  );
}
