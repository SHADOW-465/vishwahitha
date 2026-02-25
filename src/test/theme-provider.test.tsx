import { render, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

const Consumer = ({ onTheme }: { onTheme: (t: string) => void }) => {
    const { theme, setTheme } = useTheme();
    onTheme(theme);
    return <button onClick={() => setTheme("light")}>toggle</button>;
};

describe("ThemeProvider", () => {
    it("defaults to dark", () => {
        let captured = "";
        render(
            <ThemeProvider>
                <Consumer onTheme={(t) => { captured = t; }} />
            </ThemeProvider>
        );
        expect(captured).toBe("dark");
    });

    it("switches to light", async () => {
        let captured = "";
        const { getByText } = render(
            <ThemeProvider>
                <Consumer onTheme={(t) => { captured = t; }} />
            </ThemeProvider>
        );
        act(() => getByText("toggle").click());
        expect(captured).toBe("light");
    });
});
