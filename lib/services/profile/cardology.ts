import { CardEntry, CardCalculation, CardValue } from '@/lib/types/cardology';

// Helper function to calculate card value
function getCardValue(card: string): number {
  if (card === 'A') return 1;
  if (card === 'J') return 11;
  if (card === 'Q') return 12;
  if (card === 'K') return 13;
  if (card === 'Joker') return 0;
  return parseInt(card);
}

// Helper function to reduce number to single digit
function reduceToSingleDigit(num: number): number {
  while (num > 13) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num;
}

// Helper function to find card by value
function findCardByValue(value: number): CardEntry | null {
  // Convert value to card representation
  let card: string;
  if (value === 1) card = 'A';
  else if (value === 11) card = 'J';
  else if (value === 12) card = 'Q';
  else if (value === 13) card = 'K';
  else if (value === 0) return { card: 'Joker', suit: null, value: 'Joker' };
  else card = value.toString();

  // Search through matrix for first occurrence of card
  for (const month of Object.values(cardMatrix)) {
    for (const entry of Object.values(month)) {
      if (entry.card === card) {
        return entry;
      }
    }
  }
  return null;
}

// Card values for calculations
const cardValues: Record<string, number> = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'Joker': 0
};

// Matrix data from the image
const cardMatrix: Record<number, Record<number, CardEntry>> = {
  1: { // January
    1: { card: 'K', suit: '♠', value: 'King of Spades' },
    2: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    3: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    4: { card: '10', suit: '♠', value: '10 of Spades' },
    5: { card: '9', suit: '♠', value: '9 of Spades' },
    6: { card: '8', suit: '♠', value: '8 of Spades' },
    7: { card: '7', suit: '♠', value: '7 of Spades' },
    8: { card: '6', suit: '♠', value: '6 of Spades' },
    9: { card: '5', suit: '♠', value: '5 of Spades' },
    10: { card: '4', suit: '♠', value: '4 of Spades' },
    11: { card: '3', suit: '♠', value: '3 of Spades' },
    12: { card: '2', suit: '♠', value: '2 of Spades' },
    13: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    14: { card: 'K', suit: '♦', value: 'King of Diamonds' },
    15: { card: 'Q', suit: '♦', value: 'Queen of Diamonds' },
    16: { card: 'J', suit: '♦', value: 'Jack of Diamonds' },
    17: { card: '10', suit: '♦', value: '10 of Diamonds' },
    18: { card: '9', suit: '♦', value: '9 of Diamonds' },
    19: { card: '8', suit: '♦', value: '8 of Diamonds' },
    20: { card: '7', suit: '♦', value: '7 of Diamonds' },
    21: { card: '6', suit: '♦', value: '6 of Diamonds' },
    22: { card: '5', suit: '♦', value: '5 of Diamonds' },
    23: { card: '4', suit: '♦', value: '4 of Diamonds' },
    24: { card: '3', suit: '♦', value: '3 of Diamonds' },
    25: { card: '2', suit: '♦', value: '2 of Diamonds' },
    26: { card: 'A', suit: '♦', value: 'Ace of Diamonds' },
    27: { card: 'K', suit: '♣', value: 'King of Clubs' },
    28: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    29: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    30: { card: '10', suit: '♣', value: '10 of Clubs' },
    31: { card: '9', suit: '♣', value: '9 of Clubs' }
  },
  2: { // February
    1: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    2: { card: '10', suit: '♠', value: '10 of Spades' },
    3: { card: '9', suit: '♠', value: '9 of Spades' },
    4: { card: '8', suit: '♠', value: '8 of Spades' },
    5: { card: '7', suit: '♠', value: '7 of Spades' },
    6: { card: '6', suit: '♠', value: '6 of Spades' },
    7: { card: '5', suit: '♠', value: '5 of Spades' },
    8: { card: '4', suit: '♠', value: '4 of Spades' },
    9: { card: '3', suit: '♠', value: '3 of Spades' },
    10: { card: '2', suit: '♠', value: '2 of Spades' },
    11: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    12: { card: 'K', suit: '♣', value: 'King of Clubs' },
    13: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    14: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    15: { card: '10', suit: '♥', value: '10 of Hearts' },
    16: { card: '9', suit: '♥', value: '9 of Hearts' },
    17: { card: '8', suit: '♥', value: '8 of Hearts' },
    18: { card: '7', suit: '♥', value: '7 of Hearts' },
    19: { card: '6', suit: '♥', value: '6 of Hearts' },
    20: { card: '5', suit: '♥', value: '5 of Hearts' },
    21: { card: '4', suit: '♥', value: '4 of Hearts' },
    22: { card: '3', suit: '♥', value: '3 of Hearts' },
    23: { card: '2', suit: '♥', value: '2 of Hearts' },
    24: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    25: { card: 'K', suit: '♠', value: 'King of Spades' },
    26: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    27: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    28: { card: '10', suit: '♠', value: '10 of Spades' }
  },
  3: { // March
    1: { card: '9', suit: '♠', value: '9 of Spades' },
    2: { card: '8', suit: '♠', value: '8 of Spades' },
    3: { card: '7', suit: '♠', value: '7 of Spades' },
    4: { card: '6', suit: '♠', value: '6 of Spades' },
    5: { card: '5', suit: '♠', value: '5 of Spades' },
    6: { card: '4', suit: '♠', value: '4 of Spades' },
    7: { card: '3', suit: '♠', value: '3 of Spades' },
    8: { card: '2', suit: '♠', value: '2 of Spades' },
    9: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    10: { card: 'K', suit: '♣', value: 'King of Clubs' },
    11: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    12: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    13: { card: '10', suit: '♥', value: '10 of Hearts' },
    14: { card: '9', suit: '♥', value: '9 of Hearts' },
    15: { card: '8', suit: '♥', value: '8 of Hearts' },
    16: { card: '7', suit: '♥', value: '7 of Hearts' },
    17: { card: '6', suit: '♥', value: '6 of Hearts' },
    18: { card: '5', suit: '♥', value: '5 of Hearts' },
    19: { card: '4', suit: '♥', value: '4 of Hearts' },
    20: { card: '3', suit: '♥', value: '3 of Hearts' },
    21: { card: '2', suit: '♥', value: '2 of Hearts' },
    22: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    23: { card: 'K', suit: '♠', value: 'King of Spades' },
    24: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    25: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    26: { card: '10', suit: '♠', value: '10 of Spades' },
    27: { card: '9', suit: '♠', value: '9 of Spades' },
    28: { card: '8', suit: '♠', value: '8 of Spades' },
    29: { card: '7', suit: '♠', value: '7 of Spades' },
    30: { card: '6', suit: '♠', value: '6 of Spades' },
    31: { card: '5', suit: '♠', value: '5 of Spades' }
  },
  4: { // April
    1: { card: '7', suit: '♠', value: '7 of Spades' },
    2: { card: '6', suit: '♠', value: '6 of Spades' },
    3: { card: '5', suit: '♠', value: '5 of Spades' },
    4: { card: '4', suit: '♠', value: '4 of Spades' },
    5: { card: '3', suit: '♠', value: '3 of Spades' },
    6: { card: '2', suit: '♠', value: '2 of Spades' },
    7: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    8: { card: 'K', suit: '♣', value: 'King of Clubs' },
    9: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    10: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    11: { card: '10', suit: '♥', value: '10 of Hearts' },
    12: { card: '9', suit: '♥', value: '9 of Hearts' },
    13: { card: '8', suit: '♥', value: '8 of Hearts' },
    14: { card: '7', suit: '♥', value: '7 of Hearts' },
    15: { card: '6', suit: '♥', value: '6 of Hearts' },
    16: { card: '5', suit: '♥', value: '5 of Hearts' },
    17: { card: '4', suit: '♥', value: '4 of Hearts' },
    18: { card: '3', suit: '♥', value: '3 of Hearts' },
    19: { card: '2', suit: '♥', value: '2 of Hearts' },
    20: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    21: { card: 'K', suit: '♠', value: 'King of Spades' },
    22: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    23: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    24: { card: '10', suit: '♠', value: '10 of Spades' },
    25: { card: '9', suit: '♠', value: '9 of Spades' },
    26: { card: '8', suit: '♠', value: '8 of Spades' },
    27: { card: '7', suit: '♠', value: '7 of Spades' },
    28: { card: '6', suit: '♠', value: '6 of Spades' },
    29: { card: '5', suit: '♠', value: '5 of Spades' },
    30: { card: '4', suit: '♠', value: '4 of Spades' }
  },
  5: { // May
    1: { card: '5', suit: '♠', value: '5 of Spades' },
    2: { card: '4', suit: '♠', value: '4 of Spades' },
    3: { card: '3', suit: '♠', value: '3 of Spades' },
    4: { card: '2', suit: '♠', value: '2 of Spades' },
    5: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    6: { card: 'K', suit: '♣', value: 'King of Clubs' },
    7: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    8: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    9: { card: '10', suit: '♥', value: '10 of Hearts' },
    10: { card: '9', suit: '♥', value: '9 of Hearts' },
    11: { card: '8', suit: '♥', value: '8 of Hearts' },
    12: { card: '7', suit: '♥', value: '7 of Hearts' },
    13: { card: '6', suit: '♥', value: '6 of Hearts' },
    14: { card: '5', suit: '♥', value: '5 of Hearts' },
    15: { card: '4', suit: '♥', value: '4 of Hearts' },
    16: { card: '3', suit: '♥', value: '3 of Hearts' },
    17: { card: '2', suit: '♥', value: '2 of Hearts' },
    18: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    19: { card: 'K', suit: '♠', value: 'King of Spades' },
    20: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    21: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    22: { card: '10', suit: '♠', value: '10 of Spades' },
    23: { card: '9', suit: '♠', value: '9 of Spades' },
    24: { card: '8', suit: '♠', value: '8 of Spades' },
    25: { card: '7', suit: '♠', value: '7 of Spades' },
    26: { card: '6', suit: '♠', value: '6 of Spades' },
    27: { card: '5', suit: '♠', value: '5 of Spades' },
    28: { card: '4', suit: '♠', value: '4 of Spades' },
    29: { card: '3', suit: '♠', value: '3 of Spades' },
    30: { card: '2', suit: '♠', value: '2 of Spades' },
    31: { card: 'A', suit: '♠', value: 'Ace of Spades' }
  },
  6: { // June
    1: { card: '3', suit: '♠', value: '3 of Spades' },
    2: { card: '2', suit: '♠', value: '2 of Spades' },
    3: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    4: { card: 'K', suit: '♣', value: 'King of Clubs' },
    5: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    6: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    7: { card: '10', suit: '♥', value: '10 of Hearts' },
    8: { card: '9', suit: '♥', value: '9 of Hearts' },
    9: { card: '8', suit: '♥', value: '8 of Hearts' },
    10: { card: '7', suit: '♥', value: '7 of Hearts' },
    11: { card: '6', suit: '♥', value: '6 of Hearts' },
    12: { card: '5', suit: '♥', value: '5 of Hearts' },
    13: { card: '4', suit: '♥', value: '4 of Hearts' },
    14: { card: '3', suit: '♥', value: '3 of Hearts' },
    15: { card: '2', suit: '♥', value: '2 of Hearts' },
    16: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    17: { card: 'K', suit: '♠', value: 'King of Spades' },
    18: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    19: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    20: { card: '10', suit: '♠', value: '10 of Spades' },
    21: { card: '9', suit: '♠', value: '9 of Spades' },
    22: { card: '8', suit: '♠', value: '8 of Spades' },
    23: { card: '7', suit: '♠', value: '7 of Spades' },
    24: { card: '6', suit: '♠', value: '6 of Spades' },
    25: { card: '5', suit: '♠', value: '5 of Spades' },
    26: { card: '4', suit: '♠', value: '4 of Spades' },
    27: { card: '3', suit: '♠', value: '3 of Spades' },
    28: { card: '2', suit: '♠', value: '2 of Spades' },
    29: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    30: { card: 'K', suit: '♣', value: 'King of Clubs' }
  },
  7: { // July
    1: { card: 'Q', suit: '♦', value: 'Queen of Diamonds' },
    2: { card: 'J', suit: '♦', value: 'Jack of Diamonds' },
    3: { card: '10', suit: '♦', value: '10 of Diamonds' },
    4: { card: '9', suit: '♦', value: '9 of Diamonds' },
    5: { card: '10', suit: '♥', value: '10 of Hearts' },
    6: { card: '9', suit: '♥', value: '9 of Hearts' },
    7: { card: '8', suit: '♥', value: '8 of Hearts' },
    8: { card: '7', suit: '♥', value: '7 of Hearts' },
    9: { card: '6', suit: '♥', value: '6 of Hearts' },
    10: { card: '5', suit: '♥', value: '5 of Hearts' },
    11: { card: '4', suit: '♥', value: '4 of Hearts' },
    12: { card: '3', suit: '♥', value: '3 of Hearts' },
    13: { card: '2', suit: '♥', value: '2 of Hearts' },
    14: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    15: { card: 'K', suit: '♠', value: 'King of Spades' },
    16: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    17: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    18: { card: '10', suit: '♠', value: '10 of Spades' },
    19: { card: '9', suit: '♠', value: '9 of Spades' },
    20: { card: '8', suit: '♠', value: '8 of Spades' },
    21: { card: '7', suit: '♠', value: '7 of Spades' },
    22: { card: '6', suit: '♠', value: '6 of Spades' },
    23: { card: '5', suit: '♠', value: '5 of Spades' },
    24: { card: '4', suit: '♠', value: '4 of Spades' },
    25: { card: '3', suit: '♠', value: '3 of Spades' },
    26: { card: '2', suit: '♠', value: '2 of Spades' },
    27: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    28: { card: 'K', suit: '♣', value: 'King of Clubs' },
    29: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    30: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    31: { card: '10', suit: '♥', value: '10 of Hearts' }
  },
  8: { // August
    1: { card: 'Q', suit: '♦', value: 'Queen of Diamonds' },
    2: { card: 'J', suit: '♦', value: 'Jack of Diamonds' },
    3: { card: '10', suit: '♦', value: '10 of Diamonds' },
    4: { card: '9', suit: '♥', value: '9 of Hearts' },
    5: { card: '8', suit: '♥', value: '8 of Hearts' },
    6: { card: '7', suit: '♥', value: '7 of Hearts' },
    7: { card: '6', suit: '♥', value: '6 of Hearts' },
    8: { card: '5', suit: '♥', value: '5 of Hearts' },
    9: { card: '4', suit: '♥', value: '4 of Hearts' },
    10: { card: '3', suit: '♥', value: '3 of Hearts' },
    11: { card: '2', suit: '♥', value: '2 of Hearts' },
    12: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    13: { card: 'K', suit: '♠', value: 'King of Spades' },
    14: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    15: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    16: { card: '10', suit: '♠', value: '10 of Spades' },
    17: { card: '9', suit: '♠', value: '9 of Spades' },
    18: { card: '8', suit: '♠', value: '8 of Spades' },
    19: { card: '7', suit: '♠', value: '7 of Spades' },
    20: { card: '6', suit: '♠', value: '6 of Spades' },
    21: { card: '5', suit: '♠', value: '5 of Spades' },
    22: { card: '4', suit: '♠', value: '4 of Spades' },
    23: { card: '3', suit: '♠', value: '3 of Spades' },
    24: { card: '2', suit: '♠', value: '2 of Spades' },
    25: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    26: { card: 'K', suit: '♣', value: 'King of Clubs' },
    27: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    28: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    29: { card: '10', suit: '♥', value: '10 of Hearts' },
    30: { card: '9', suit: '♥', value: '9 of Hearts' },
    31: { card: '8', suit: '♥', value: '8 of Hearts' }
  },
  9: { // September
    1: { card: '10', suit: '♥', value: '10 of Hearts' },
    2: { card: '9', suit: '♥', value: '9 of Hearts' },
    3: { card: '8', suit: '♥', value: '8 of Hearts' },
    4: { card: '7', suit: '♥', value: '7 of Hearts' },
    5: { card: '6', suit: '♥', value: '6 of Hearts' },
    6: { card: '5', suit: '♥', value: '5 of Hearts' },
    7: { card: '4', suit: '♥', value: '4 of Hearts' },
    8: { card: '3', suit: '♥', value: '3 of Hearts' },
    9: { card: '2', suit: '♥', value: '2 of Hearts' },
    10: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    11: { card: 'K', suit: '♠', value: 'King of Spades' },
    12: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    13: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    14: { card: '10', suit: '♠', value: '10 of Spades' },
    15: { card: '9', suit: '♠', value: '9 of Spades' },
    16: { card: '8', suit: '♠', value: '8 of Spades' },
    17: { card: '7', suit: '♠', value: '7 of Spades' },
    18: { card: '6', suit: '♠', value: '6 of Spades' },
    19: { card: '5', suit: '♠', value: '5 of Spades' },
    20: { card: '4', suit: '♠', value: '4 of Spades' },
    21: { card: '3', suit: '♠', value: '3 of Spades' },
    22: { card: '2', suit: '♠', value: '2 of Spades' },
    23: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    24: { card: 'K', suit: '♣', value: 'King of Clubs' },
    25: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    26: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    27: { card: '10', suit: '♥', value: '10 of Hearts' },
    28: { card: '9', suit: '♥', value: '9 of Hearts' },
    29: { card: '8', suit: '♥', value: '8 of Hearts' },
    30: { card: '7', suit: '♥', value: '7 of Hearts' }
  },
  10: { // October
    1: { card: '8', suit: '♥', value: '8 of Hearts' },
    2: { card: '7', suit: '♥', value: '7 of Hearts' },
    3: { card: '6', suit: '♥', value: '6 of Hearts' },
    4: { card: '5', suit: '♥', value: '5 of Hearts' },
    5: { card: '4', suit: '♥', value: '4 of Hearts' },
    6: { card: '3', suit: '♥', value: '3 of Hearts' },
    7: { card: '2', suit: '♥', value: '2 of Hearts' },
    8: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    9: { card: 'K', suit: '♠', value: 'King of Spades' },
    10: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    11: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    12: { card: '10', suit: '♠', value: '10 of Spades' },
    13: { card: '9', suit: '♠', value: '9 of Spades' },
    14: { card: '8', suit: '♠', value: '8 of Spades' },
    15: { card: '7', suit: '♠', value: '7 of Spades' },
    16: { card: '6', suit: '♠', value: '6 of Spades' },
    17: { card: '5', suit: '♠', value: '5 of Spades' },
    18: { card: '4', suit: '♠', value: '4 of Spades' },
    19: { card: '3', suit: '♠', value: '3 of Spades' },
    20: { card: '2', suit: '♠', value: '2 of Spades' },
    21: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    22: { card: 'K', suit: '♣', value: 'King of Clubs' },
    23: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    24: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    25: { card: '10', suit: '♥', value: '10 of Hearts' },
    26: { card: '9', suit: '♥', value: '9 of Hearts' },
    27: { card: '8', suit: '♥', value: '8 of Hearts' },
    28: { card: '7', suit: '♥', value: '7 of Hearts' },
    29: { card: '6', suit: '♥', value: '6 of Hearts' },
    30: { card: '5', suit: '♥', value: '5 of Hearts' },
    31: { card: '4', suit: '♥', value: '4 of Hearts' }
  },
  11: { // November
    1: { card: '6', suit: '♥', value: '6 of Hearts' },
    2: { card: '5', suit: '♥', value: '5 of Hearts' },
    3: { card: '4', suit: '♥', value: '4 of Hearts' },
    4: { card: '3', suit: '♥', value: '3 of Hearts' },
    5: { card: '2', suit: '♥', value: '2 of Hearts' },
    6: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    7: { card: 'K', suit: '♠', value: 'King of Spades' },
    8: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    9: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    10: { card: '10', suit: '♠', value: '10 of Spades' },
    11: { card: '9', suit: '♠', value: '9 of Spades' },
    12: { card: '8', suit: '♠', value: '8 of Spades' },
    13: { card: '7', suit: '♠', value: '7 of Spades' },
    14: { card: '6', suit: '♠', value: '6 of Spades' },
    15: { card: '5', suit: '♠', value: '5 of Spades' },
    16: { card: '4', suit: '♠', value: '4 of Spades' },
    17: { card: '3', suit: '♠', value: '3 of Spades' },
    18: { card: '2', suit: '♠', value: '2 of Spades' },
    19: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    20: { card: 'K', suit: '♣', value: 'King of Clubs' },
    21: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    22: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    23: { card: '10', suit: '♥', value: '10 of Hearts' },
    24: { card: '9', suit: '♥', value: '9 of Hearts' },
    25: { card: '8', suit: '♥', value: '8 of Hearts' },
    26: { card: '7', suit: '♥', value: '7 of Hearts' },
    27: { card: '6', suit: '♥', value: '6 of Hearts' },
    28: { card: '5', suit: '♥', value: '5 of Hearts' },
    29: { card: '4', suit: '♥', value: '4 of Hearts' },
    30: { card: '3', suit: '♥', value: '3 of Hearts' }
  },
  12: { // December
    1: { card: '4', suit: '♥', value: '4 of Hearts' },
    2: { card: '3', suit: '♥', value: '3 of Hearts' },
    3: { card: '2', suit: '♥', value: '2 of Hearts' },
    4: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    5: { card: 'K', suit: '♠', value: 'King of Spades' },
    6: { card: 'Q', suit: '♠', value: 'Queen of Spades' },
    7: { card: 'J', suit: '♠', value: 'Jack of Spades' },
    8: { card: '10', suit: '♠', value: '10 of Spades' },
    9: { card: '9', suit: '♠', value: '9 of Spades' },
    10: { card: '8', suit: '♠', value: '8 of Spades' },
    11: { card: '7', suit: '♠', value: '7 of Spades' },
    12: { card: '6', suit: '♠', value: '6 of Spades' },
    13: { card: '5', suit: '♠', value: '5 of Spades' },
    14: { card: '4', suit: '♠', value: '4 of Spades' },
    15: { card: '3', suit: '♠', value: '3 of Spades' },
    16: { card: '2', suit: '♠', value: '2 of Spades' },
    17: { card: 'A', suit: '♠', value: 'Ace of Spades' },
    18: { card: 'K', suit: '♣', value: 'King of Clubs' },
    19: { card: 'Q', suit: '♣', value: 'Queen of Clubs' },
    20: { card: 'J', suit: '♣', value: 'Jack of Clubs' },
    21: { card: '10', suit: '♥', value: '10 of Hearts' },
    22: { card: '9', suit: '♥', value: '9 of Hearts' },
    23: { card: '8', suit: '♥', value: '8 of Hearts' },
    24: { card: '7', suit: '♥', value: '7 of Hearts' },
    25: { card: '6', suit: '♥', value: '6 of Hearts' },
    26: { card: '5', suit: '♥', value: '5 of Hearts' },
    27: { card: '4', suit: '♥', value: '4 of Hearts' },
    28: { card: '3', suit: '♥', value: '3 of Hearts' },
    29: { card: '2', suit: '♥', value: '2 of Hearts' },
    30: { card: 'A', suit: '♥', value: 'Ace of Hearts' },
    31: { card: 'Joker', suit: '♠', value: 'Joker' }
  }
};

// Function to get birth card from date
export function getBirthCard(date: Date): CardEntry | null {
  try {
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    const day = date.getDate();

    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    const monthData = cardMatrix[month];
    if (!monthData) return null;

    const cardData = monthData[day];
    if (!cardData) return null;

    return cardData;
  } catch (error) {
    console.error('Error getting birth card:', error);
    return null;
  }
}

// Function to get personality card
export function getPersonalityCard(birthCard: CardEntry): CardEntry | null {
  // Implement personality card calculation based on birth card
  // This would be based on cartology rules
  return null;
}

// Function to get soul card
export function getSoulCard(birthCard: CardEntry): CardEntry | null {
  // Implement soul card calculation based on birth card
  // This would be based on cartology rules
  return null;
}

// Helper function to parse date string
export function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

// Function to get all cards for a birth date
export function getCards(birthDate: string) {
  const date = parseDate(birthDate);
  if (!date) return null;

  const birthCard = getBirthCard(date);
  if (!birthCard) return null;

  return {
    birthCard,
    personalityCard: getPersonalityCard(birthCard),
    soulCard: getSoulCard(birthCard)
  };
}
