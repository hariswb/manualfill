import React from "react";
import { createRoot } from "react-dom/client";
import Toolbar from "./toolbar";
import Pin from "./pin";
import { useToolbarStore } from "./store";
import "../assets/toolbar.css";
import Controller from "./controller";

var focusedInputHostId: string | null = null;

function ManualFill(){
  const isDisplayed = useToolbarStore((state)=>state.isDisplayed)
  return <>
    {isDisplayed?<Toolbar/>:<Controller/>}
    <Pin/>
  </>
}

document.addEventListener("click", (e: Event) => {
  // Open toolbar when focusing in host's input

  if (!e.target) return;
  if (
    !(
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    )
  )
    return;

  const eventTarget: HTMLInputElement | HTMLTextAreaElement = e.target;

  if (
    eventTarget.ariaLabel === "Search" ||
    eventTarget.type === "password" ||
    eventTarget.type === "range"
  )
    return;

  if (container.contains(eventTarget)) return;

  focusedInputHostId = eventTarget.id;

  useToolbarStore.getState().updateFocusedHostInputId(focusedInputHostId);
});

document.addEventListener("click", (e: Event) => {
  // Close toolbar when clicking anywhere on host page

  if (!e.target || e.target instanceof Element === false) return;
  const eventTarget: Element = e.target;

  const manualFill: HTMLElement | null = document.querySelector("manualfill");

  if (!manualFill) return;
  if (manualFill.contains(eventTarget)) return;

  if (!focusedInputHostId) return;
  const focusedInputHost: HTMLElement | null =
    document.getElementById(focusedInputHostId);
  if (!focusedInputHost) return;
  if (focusedInputHost.contains(e.target)) return;

  useToolbarStore.getState().updateFocusedHostInputId(null);
});

const container: HTMLElement = document.createElement("manualfill");
document.documentElement.appendChild(container);
const root = createRoot(container);
root.render(<ManualFill />);
