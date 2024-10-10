import React, {
  useState,
  useEffect,
  MouseEvent,
  useRef,
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


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
    setIsDragging(true);
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
        className="header prevent-select"
        onMouseDown={handleMouseDown}
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
