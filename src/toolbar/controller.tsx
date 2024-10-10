import React, { useEffect, useState, useLayoutEffect } from "react";
import { useToolbarStore } from "./store";
import Logo from "./logo";

interface IPos {
  x: number;
  y: number;
}

export default function Controller() {
  // Local State

  const updateIsDisplayed = useToolbarStore((state) => state.updateIsDisplayed);
  const isDisplayed = useToolbarStore((state) => state.isDisplayed);
  const updateSearchTerm = useToolbarStore((state) => state.updateSearchTerm);
  const searchTerm = useToolbarStore((state) => state.searchTerm);
  const fetchSearchResults = useToolbarStore(
    (state) => state.fetchSearchResults
  );

  const [controllerPos, setControllerPos] = useState<IPos>({ x: 10, y: 10 });

  useEffect(() => {
    // updateSearchTerm("")
    fetchSearchResults(searchTerm);
  }, [isDisplayed]);

  useLayoutEffect(() => {
    function updateSize() {
      setControllerPos({
        x: window.innerWidth - 120,
        y: window.innerHeight - 80,
      });
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="controller prevent-select"
      style={{
        left: `${controllerPos.x}px`,
        top: `${controllerPos.y}px`,
      }}
      onClick={() => {
        updateIsDisplayed(true);
      }}
    >
      <div
        className="controller-logo"
        onClick={() => {
          updateIsDisplayed(true);
        }}
      >
        <Logo />
      </div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <span className="controller-open material-symbols-outlined">
        keyboard_arrow_up
      </span>
    </div>
  );
}
