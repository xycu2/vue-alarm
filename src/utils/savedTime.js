export function initTheme() {
  const savedTheme = localStorage.getItem("mindup_theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
}
