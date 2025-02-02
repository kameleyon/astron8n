export type PlanetaryRuler = 
  | "Sun" 
  | "Mercury" 
  | "Venus" 
  | "Mars" 
  | "Jupiter" 
  | "Saturn" 
  | "Uranus" 
  | "Neptune" 
  | "Pluto" 
  | "Bacchus" 
  | "Vulcan" 
  | "Moon" 
  | "Earth";

export interface CardMeaning {
  name: string;
  suit: "Hearts" | "Clubs" | "Diamonds" | "Spades";
  value: string;
  planetaryRuler: PlanetaryRuler;
  zodiacRuler: string;
  keywords: string[];
  suitMeaning: string;
}
