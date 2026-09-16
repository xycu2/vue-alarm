// ========== СМЕНА ТЕМЫ =========
import { ref } from "vue";

const savedTheme = localStorage.getItem("mindup_theme") || 'dark';
const isLight = ref(savedTheme === 'light')

if (isLight.value) {
  document.body.classList.add("light-theme");
}

export function useTheme() {

  const toggleTheme = () => {
    isLight.value = !isLight.value;

    document.body.classList.toggle("light-theme", isLight.value);

    const newTheme = isLight.value ? "light" : "dark";
    localStorage.setItem("mindup_theme", newTheme);

  }
  return {
      isLight,
      toggleTheme
  }

}
