describe("announcement form data parsing", () => {
    it("detects pinned when is_pinned is 'true'", () => {
        const isPinned = (val: string) => val === "true";
        expect(isPinned("true")).toBe(true);
        expect(isPinned("false")).toBe(false);
        expect(isPinned("")).toBe(false);
    });

    it("defaults visibility to public", () => {
        const getVisibility = (val: string | null) => val || "public";
        expect(getVisibility(null)).toBe("public");
        expect(getVisibility("members")).toBe("members");
    });
});
