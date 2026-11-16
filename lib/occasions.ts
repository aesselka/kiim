import type { Look, Mood, Occasion, OccasionId, Selection } from "./types";

const CAMERA = "35mm film look, natural skin texture, soft film grain";

function editorial(outfit: string, scene: string, light: string) {
  return `full-body fashion editorial photo of a young woman wearing ${outfit}, ${scene}, ${light}, ${CAMERA}`;
}

function look(occasion: OccasionId, mood: Mood, data: Omit<Look, "id" | "mood" | "demoImage">): Look {
  const slug = mood.toLowerCase();
  return {
    id: `${occasion}-${slug}`,
    mood,
    demoImage: `/lookbook/${occasion}-${slug}.jpg`,
    ...data,
  };
}

export const OCCASIONS: Occasion[] = [
  {
    id: "date",
    name: "Date",
    hint: "Dinner, candles, a little nervous",
    looks: [
      look("date", "Classic", {
        title: "Candlelit Slip",
        note: "Soft fabric, warm light — let the dress do the talking.",
        pieces: ["Champagne satin slip dress", "Fine gold chain", "Strappy heels"],
        palette: ["#E6D3B3", "#C9A15B", "#3B2F27"],
        prompt: editorial(
          "a champagne bias-cut satin slip midi dress, thin gold jewelry, strappy heels",
          "standing in a dark studio",
          "warm orange rim light",
        ),
      }),
      look("date", "Bold", {
        title: "Red Hour",
        note: "One colour, worn with complete conviction.",
        pieces: ["Cherry one-shoulder midi dress", "Sculptural gold earrings", "Black pointed slingbacks"],
        palette: ["#9E1B1E", "#D2A447", "#111111"],
        prompt: editorial(
          "a cherry-red one-shoulder midi dress, sculptural gold earrings, black pointed slingback heels",
          "standing in a dim restaurant at night, blurred candlelight behind her",
          "low warm light from the side",
        ),
      }),
      look("date", "Effortless", {
        title: "Linen & Wine",
        note: "Looks like you didn't try. You did — just a little.",
        pieces: ["White poplin shirt, half-tucked", "Dark straight jeans", "Leather loafers", "Small gold hoops"],
        palette: ["#F1EDE4", "#2B3442", "#6B4A32"],
        prompt: editorial(
          "a crisp white poplin shirt half-tucked into dark straight-leg jeans, brown leather loafers, small gold hoop earrings",
          "standing on a terrace at dusk, city lights far behind",
          "warm string-light glow",
        ),
      }),
    ],
  },
  {
    id: "wedding",
    name: "Wedding",
    hint: "A guest, not the bride",
    looks: [
      look("wedding", "Classic", {
        title: "Garden Silk",
        note: "Elegant and quiet — never competing with the bride.",
        pieces: ["Sage silk midi dress", "Pearl drop earrings", "Nude block heels"],
        palette: ["#A9B39A", "#EDE6DA", "#C8AE95"],
        prompt: editorial(
          "a sage-green silk midi dress with a draped neckline, pearl drop earrings, nude block heels",
          "standing in a dark garden pavilion at evening",
          "soft warm lantern light",
        ),
      }),
      look("wedding", "Bold", {
        title: "Cobalt Pleats",
        note: "Colour that photographs beautifully from the back row.",
        pieces: ["Cobalt plissé maxi dress", "Gold cuff", "Metallic sandals"],
        palette: ["#1F3FA6", "#D4AF5A", "#E9E4DC"],
        prompt: editorial(
          "a cobalt-blue plissé maxi dress, wide gold cuff bracelet, metallic strappy sandals",
          "standing in a dark studio",
          "warm orange rim light against cool shadow",
        ),
      }),
      look("wedding", "Effortless", {
        title: "Powder Suit",
        note: "A suit that will still be dancing at midnight.",
        pieces: ["Powder-blue tailored suit", "Ivory silk camisole", "Kitten heels"],
        palette: ["#B9C9DB", "#F2EDE3", "#8E8A86"],
        prompt: editorial(
          "a powder-blue tailored suit over an ivory silk camisole, pointed kitten heels, delicate pearl necklace",
          "standing in an evening banquet hall with dim warm lights",
          "soft cinematic light",
        ),
      }),
    ],
  },
  {
    id: "interview",
    name: "Interview",
    hint: "First impression, clear head",
    looks: [
      look("interview", "Classic", {
        title: "Quiet Authority",
        note: "Sharp lines, nothing to distract from what you say.",
        pieces: ["Charcoal wool blazer", "Ivory silk blouse", "Black tailored trousers", "Pointed loafers"],
        palette: ["#3A3A3C", "#EFE9DF", "#121212"],
        prompt: editorial(
          "a charcoal wool blazer over an ivory silk blouse, black tailored trousers, pointed black loafers",
          "standing in a dark minimalist studio",
          "soft key light with warm rim light",
        ),
      }),
      look("interview", "Bold", {
        title: "Camel Column",
        note: "Head-to-toe monochrome reads as decisive.",
        pieces: ["Camel fine-knit turtleneck", "Wide-leg camel trousers", "Long camel coat"],
        palette: ["#B88A5A", "#D9BFA0", "#4A3626"],
        prompt: editorial(
          "a monochrome camel outfit: fine-knit turtleneck, high-waisted wide-leg trousers and a long camel wool coat, brown leather boots",
          "standing in a dark studio",
          "warm orange rim light",
        ),
      }),
      look("interview", "Effortless", {
        title: "Soft Tailoring",
        note: "Polished for the meeting, relaxed enough for the team.",
        pieces: ["Navy knit cardigan", "Cream pleated trousers", "White leather sneakers"],
        palette: ["#1E2A44", "#EDE5D6", "#F7F5F0"],
        prompt: editorial(
          "a navy fine-knit buttoned cardigan, cream pleated wide trousers, clean white leather sneakers, thin silver watch",
          "standing in a dim creative office with warm desk lamps behind her",
          "soft evening light",
        ),
      }),
    ],
  },
  {
    id: "party",
    name: "Party",
    hint: "Music loud, lights low",
    looks: [
      look("party", "Classic", {
        title: "Black Velvet",
        note: "The little black dress — with a little more texture.",
        pieces: ["Long-sleeve velvet mini dress", "Sheer black tights", "Patent pumps"],
        palette: ["#0E0E10", "#2A2427", "#C0B6AE"],
        prompt: editorial(
          "a long-sleeve black velvet mini dress, sheer black tights, glossy patent pumps, small diamond studs",
          "standing in a dark lounge at night",
          "warm orange rim light, deep shadows",
        ),
      }),
      look("party", "Bold", {
        title: "Liquid Silver",
        note: "Catches every light in the room, on purpose.",
        pieces: ["Silver sequin slip dress", "Black strappy sandals", "Sculptural ear cuffs"],
        palette: ["#C9CCD1", "#6E7178", "#0B0B0C"],
        prompt: editorial(
          "a silver sequin slip dress, black strappy sandals, sculptural silver ear cuffs",
          "standing in a dark club with blurred warm lights behind",
          "flash photography with warm ambient glow",
        ),
      }),
      look("party", "Effortless", {
        title: "Satin & Denim",
        note: "Dressed up from the waist up — the easiest trick there is.",
        pieces: ["Chocolate satin camisole", "Dark wide-leg jeans", "Heeled mules", "Gold hoops"],
        palette: ["#4A2E22", "#1F2633", "#C79A5B"],
        prompt: editorial(
          "a chocolate-brown satin camisole, dark wide-leg jeans, black heeled mules, chunky gold hoop earrings",
          "standing at a house party at night, soft bokeh behind",
          "warm tungsten light",
        ),
      }),
    ],
  },
  {
    id: "weekend",
    name: "Weekend",
    hint: "Coffee, a walk, no plans",
    looks: [
      look("weekend", "Classic", {
        title: "Trench Sunday",
        note: "The uniform that never gets old.",
        pieces: ["Beige trench coat", "Breton striped top", "Straight blue jeans", "Ballet flats"],
        palette: ["#C8B08A", "#1F2C4A", "#F2EEE6"],
        prompt: editorial(
          "a beige trench coat over a navy-and-white breton striped top, straight blue jeans, black ballet flats",
          "standing on a quiet city street in the early evening",
          "warm low golden light",
        ),
      }),
      look("weekend", "Bold", {
        title: "Butter Knit",
        note: "A mood-lifting colour for a slow day.",
        pieces: ["Butter-yellow oversized knit", "Cream wide trousers", "Suede loafers"],
        palette: ["#F0D98A", "#EFE7D6", "#8C6A4A"],
        prompt: editorial(
          "an oversized butter-yellow chunky knit sweater, cream wide-leg trousers, tan suede loafers",
          "standing in a dark studio",
          "warm orange rim light",
        ),
      }),
      look("weekend", "Effortless", {
        title: "Oat Layers",
        note: "Soft layers, zero effort, still put together.",
        pieces: ["Oatmeal knit cardigan", "Matching knit trousers", "Canvas tote"],
        palette: ["#D8CBB6", "#A99883", "#5A4E42"],
        prompt: editorial(
          "a matching oatmeal knit cardigan and wide knit trousers, white tank top, canvas tote bag, minimal sneakers",
          "standing in a dim cafe in the evening",
          "warm window light",
        ),
      }),
    ],
  },
];

export function getOccasion(id: OccasionId) {
  return OCCASIONS.find((o) => o.id === id) ?? OCCASIONS[0];
}

type CustomMood = Omit<Look, "id" | "prompt" | "title"> & {
  titles: string[];
  styling: string;
  pose: string;
};

/**
 * "Your own": her words lead the prompt (place, outfit, light), each mood only
 * adds styling and a different pose/camera so the three looks feel distinct.
 * Demo images fall back to a preset look of the same mood.
 */
const CUSTOM_MOODS: CustomMood[] = [
  {
    mood: "Classic",
    titles: ["{k}, Softly", "Quiet {k}", "{k}, Composed"],
    note: "Clean lines and nothing extra — your idea, said elegantly.",
    pieces: ["A clean, tailored silhouette", "Minimal refined jewelry", "Polished shoes"],
    palette: ["#F2EEE6", "#D8C7AE", "#2E2A27"],
    styling: "timeless tailored styling, refined minimal accessories",
    pose: "elegant poised stance, one hand lightly at the waist, eye-level full-body shot",
    demoImage: "/lookbook/interview-classic.jpg",
  },
  {
    mood: "Bold",
    titles: ["{k}, Turned Up", "{k} After Hours", "Statement {k}"],
    note: "The same idea with the volume up — made to be photographed.",
    pieces: ["One statement detail", "Sculptural accessories", "Confident heels"],
    palette: ["#F5E6D3", "#C9A15B", "#141414"],
    styling: "bold high-fashion styling, one striking statement detail, sculptural accessories",
    pose: "dynamic confident editorial pose, low camera angle, slight motion in the fabric",
    demoImage: "/lookbook/wedding-bold.jpg",
  },
  {
    mood: "Effortless",
    titles: ["Easy {k}", "{k}, Undone", "{k} in Passing"],
    note: "Relaxed and airy — looks like you just happened to be there.",
    pieces: ["Soft, airy layers", "Natural fabrics", "Easy flat shoes"],
    palette: ["#FAF7F2", "#E3D5C3", "#8FA3A8"],
    styling: "relaxed effortless styling, airy natural fabrics",
    pose: "candid walking pose mid-step, looking away from the camera, natural movement",
    demoImage: "/lookbook/weekend-effortless.jpg",
  },
];

/** Max length of the "Your own" text; long enough for a detailed wish list. */
export const CUSTOM_MAX = 500;

const STOPWORDS = new Set(
  "a an the and or but with without of for to in on at by from into onto it its it's is are be make let do does place occasion please me my i want wear wearing dress dressed outfit look looks not too much very so some this that".split(" "),
);

/** Two meaningful words from her text, title-cased: "place lake Como with…" → "Lake Como". */
export function wishKeywords(text: string) {
  const words = text
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w.toLowerCase()))
    .slice(0, 2);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Your Own";
}

function hash(text: string) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function customLooks(text: string): [Look, Look, Look] {
  const wish = text.trim().replace(/\s+/g, " ").slice(0, CUSTOM_MAX);
  const keywords = wishKeywords(wish);
  const pick = hash(wish);
  const [a, b, c] = CUSTOM_MOODS.map(({ titles, styling, pose, ...m }) => ({
    id: `custom-${m.mood.toLowerCase()}`,
    ...m,
    title: titles[pick % titles.length].replace("{k}", keywords),
    prompt: `full-body fashion editorial photo of a young woman. ${wish}. Styling: ${styling}. Pose and camera: ${pose}. ${CAMERA}`,
  }));
  return [a, b, c];
}

export function looksFor(selection: Selection): [Look, Look, Look] {
  return selection.kind === "preset" ? getOccasion(selection.id).looks : customLooks(selection.text);
}

export function lookLabel(index: number, mood: Mood) {
  return `Look ${String(index + 1).padStart(2, "0")} · ${mood}`;
}
