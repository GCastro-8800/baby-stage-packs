export function openExternal(url: string) {
  // Open about:blank first to avoid ERR_BLOCKED_BY_RESPONSE from
  // sites like wa.me that send X-Frame-Options headers.
  // The blank popup is same-origin so it bypasses iframe restrictions,
  // then navigating it to the target URL works because it's now a
  // top-level browsing context.
  const win = window.open("about:blank", "_blank");
  if (win) {
    win.opener = null;
    win.location.href = url;
  } else {
    // Popup was blocked entirely — navigate the current tab as last resort
    window.location.href = url;
  }
}
