import { create } from "zustand";
import toast from "react-hot-toast";

export const useThemeStore = create((set, get) => ({

  theme: localStorage.getItem("theme") || "light",           
    toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        localStorage.setItem("theme", newTheme);
        toast.success(`Switched to ${newTheme} mode`);
    }   ,
}));    