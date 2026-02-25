"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "dark",
    setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>("dark");

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);
        // Sync to body data-theme attribute for CSS variable switching
        document.body.setAttribute("data-theme", t === "light" ? "light" : "");
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
