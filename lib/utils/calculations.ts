import { magianDayCards } from '@/data/cardologyCalendar';

export function calculateLifePath(birthDate: string): string {
  // Convert YYYY-MM-DD to numbers
  const [year, month, day] = birthDate.split('-').map(Number);
  
  // Calculate life path number
  let sum = day + month + Array.from(String(year)).reduce((a, b) => a + Number(b), 0);
  
  // Keep reducing until we get a single digit (except 11, 22, 33)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = Array.from(String(sum)).reduce((a, b) => a + Number(b), 0);
  }
  
  return String(sum);
}

export function getBirthCard(birthDate: string): string {
  // Convert YYYY-MM-DD to MM and DD
  const [_, month, day] = birthDate.split('-');
  
  // Pad month and day with leading zeros if needed
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  
  // Get card from magianDayCards
  const monthCards = magianDayCards[paddedMonth as keyof typeof magianDayCards];
  if (!monthCards) return "Not available";
  
  const card = monthCards[paddedDay as keyof typeof monthCards];
  return card || "Not available";
}
