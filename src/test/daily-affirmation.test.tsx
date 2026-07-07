import { render, fireEvent, screen } from "@testing-library/react";
import { DailyAffirmation } from "@/components/daily-affirmation";

// Mock toast to avoid actual notification triggers in tests
vi.mock("react-hot-toast", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("DailyAffirmation Component", () => {
    it("renders front side by default with quote content", () => {
        render(
            <DailyAffirmation 
                initialQuote="Inspiring quote here." 
                initialChallenge="Challenge action here." 
            />
        );
        
        // Header text is present
        expect(screen.getByText("The Daily")).toBeInTheDocument();
        expect(screen.getByText("Inspiration")).toBeInTheDocument();
        
        // Quote text container is present
        expect(screen.getByText("Tap to reveal challenge")).toBeInTheDocument();
    });

    it("toggles the flipped state on card click", () => {
        const { container } = render(
            <DailyAffirmation 
                initialQuote="Inspiring quote here." 
                initialChallenge="Challenge action here." 
            />
        );
        
        // Initially, the challenge text is present in the DOM (but hidden visually/interactively)
        expect(screen.getByText("Challenge action here.")).toBeInTheDocument();
        expect(screen.getByText("Tap to reveal challenge")).toBeInTheDocument();
        
        // Find the flip card container (the one with perspective-1000)
        const flipCard = container.querySelector(".perspective-1000");
        expect(flipCard).toBeInTheDocument();
        
        // Click the card
        if (flipCard) {
            fireEvent.click(flipCard);
        }
        
        // Affirmation and Challenge items are both rendering (Framer Motion controls active display dynamically)
        expect(screen.getByText("Tap to read quote again")).toBeInTheDocument();
    });
});
