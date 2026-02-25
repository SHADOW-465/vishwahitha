describe("initiative slug generation", () => {
    const makeSlug = (title: string) =>
        title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    it("converts spaces to dashes", () => {
        expect(makeSlug("Elder Care Initiative")).toBe("elder-care-initiative");
    });

    it("strips special characters", () => {
        expect(makeSlug("WishFit: Clothing!")).toBe("wishfit-clothing");
    });

    it("handles single word", () => {
        expect(makeSlug("INDRU")).toBe("indru");
    });
});
