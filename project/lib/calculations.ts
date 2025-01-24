"use client";

export function calculateLifePathNumber(birthDate: string): { number: number; meaning: string } {
  // Convert date string to numbers, using UTC to prevent timezone issues
  const date = new Date(birthDate + 'T00:00:00Z');
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  // Calculate life path number by adding all digits until single digit
  let sum = Array.from(month.toString() + day.toString() + year.toString())
    .map(Number)
    .reduce((a, b) => a + b, 0);

  // Keep reducing until single digit (except master numbers 11, 22, 33)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = Array.from(sum.toString()).map(Number).reduce((a, b) => a + b, 0);
  }

  const meanings: { [key: number]: string } = {
    1: "The Leader",
    2: "The Mediator",
    3: "The Creative",
    4: "The Builder",
    5: "The Freedom Seeker",
    6: "The Nurturer",
    7: "The Seeker",
    8: "The Powerhouse",
    9: "The Humanitarian",
    11: "The Intuitive",
    22: "The Master Builder",
    33: "The Master Teacher"
  };

  return {
    number: sum,
    meaning: meanings[sum] || "Unknown"
  };
}

export function calculateBirthCard(birthDate: string): { card: string; meaning: string } {
  // Convert date to day of year using UTC
  const date = new Date(birthDate + 'T00:00:00Z');
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Map day of year to card (simplified version)
  const cards = [
    { card: "The Magician", meaning: "Manifestation & Power" },
    { card: "The High Priestess", meaning: "Intuition & Mystery" },
    { card: "The Empress", meaning: "Abundance & Nurturing" },
    { card: "The Emperor", meaning: "Authority & Structure" },
    { card: "The Hierophant", meaning: "Tradition & Guidance" },
    { card: "The Lovers", meaning: "Choice & Harmony" },
    { card: "The Chariot", meaning: "Determination & Will" },
    { card: "Strength", meaning: "Courage & Inner Power" },
    { card: "The Hermit", meaning: "Wisdom & Solitude" },
    { card: "Wheel of Fortune", meaning: "Cycles & Destiny" },
    { card: "Justice", meaning: "Balance & Truth" },
    { card: "The Hanged Man", meaning: "Surrender & New Perspective" },
    { card: "Death", meaning: "Transformation & Renewal" },
    { card: "Temperance", meaning: "Balance & Moderation" },
    { card: "The Devil", meaning: "Liberation & Shadow Self" },
    { card: "The Tower", meaning: "Awakening & Breakthrough" },
    { card: "The Star", meaning: "Hope & Inspiration" },
    { card: "The Moon", meaning: "Intuition & Dreams" },
    { card: "The Sun", meaning: "Joy & Vitality" },
    { card: "Judgement", meaning: "Rebirth & Inner Calling" },
    { card: "The World", meaning: "Completion & Integration" }
  ];

  const index = dayOfYear % cards.length;
  return cards[index];
}

export function calculateHumanDesign(birthDate: string, birthTime: string | null): { 
  type: string; 
  profile: string;
  meaning: string;
} {
  // Use UTC date to prevent timezone issues
  const date = new Date(birthDate + 'T00:00:00Z');
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const types = [
    { type: "Generator", profile: "2/4", meaning: "Life Force & Social Influence" },
    { type: "Manifesting Generator", profile: "3/5", meaning: "Multi-Faceted Creator" },
    { type: "Projector", profile: "1/3", meaning: "Guide & Experimenter" },
    { type: "Manifestor", profile: "4/6", meaning: "Initiator & Role Model" },
    { type: "Reflector", profile: "5/1", meaning: "Evaluator & Investigator" }
  ];

  // Use day of year to determine type (simplified mapping)
  const typeIndex = dayOfYear % types.length;
  return types[typeIndex];
}