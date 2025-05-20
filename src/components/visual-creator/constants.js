/**
 * Constants for the Visual Creator component
 */

// Image size options
export const IMAGE_SIZES = [
  { value: "square_hd", label: "Square HD" },
  { value: "square", label: "Square" },
  { value: "portrait_4_3", label: "Portrait 4:3" },
  { value: "portrait_16_9", label: "Portrait 16:9" },
  { value: "landscape_4_3", label: "Landscape 4:3" },
  { value: "landscape_16_9", label: "Landscape 16:9" },
];

// Default prompt
export const DEFAULT_PROMPT = "A beautiful landscape with mountains and a lake, digital art style";

// Proto style metaprompt template
export const PROTO_STYLE_TEMPLATE = `A mathematically precise digital illustration in the "proto" style, featuring [INSERT SHAPE OR SUBJECT] rendered with flawless, mechanically perfect lines. The design uses smooth, continuous neon-gradient strokes that transition through a calculated spectrum of hues—such as violet, emerald green, burnt orange, and golden yellow. All curves and angles are precisely plotted, free of any organic or hand-drawn artifacts. Set against a deep black background, the glowing forms appear weightless and engineered, creating a sense of abstract order and visual rhythm. Each element is evenly spaced, symmetrical, and aligned to convey an aura of synthetic harmony. The composition suggests themes of [INSERT THEMATIC ELEMENTS OR CONCEPTS], interpreted through a futuristic, minimalist visual language. Ideal for sci-fi aesthetics, advanced data visualizations, or conceptual UI design rendered with digital purity and geometric clarity.`;
