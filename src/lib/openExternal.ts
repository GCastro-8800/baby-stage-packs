export function openExternal(url: string) {
  // Try opening from the top-level window to escape iframe restrictions
  const top = window.top || window.parent || window;
  const win = top.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    // Fallback: try from current window
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
