export function getFocusedHostInput(
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

export function getLabelText(
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