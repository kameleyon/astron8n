// Life Path Number calculation
export function calculateLifePath(birthDate: string): string {
  try {
    // Remove any non-numeric characters
    const dateStr = birthDate.replace(/\D/g, '');
    
    if (dateStr.length < 8) return '0'; // Invalid date
    
    // Extract month, day, year
    const month = parseInt(dateStr.substring(0, 2));
    const day = parseInt(dateStr.substring(2, 4));
    const year = parseInt(dateStr.substring(4));
    
    // Sum each component
    const monthSum = reduceToSingleDigit(month);
    const daySum = reduceToSingleDigit(day);
    const yearSum = reduceToSingleDigit(year);
    
    // Get final sum
    let lifePath = reduceToSingleDigit(monthSum + daySum + yearSum);
    
    // Handle master numbers
    if (lifePath === 11 || lifePath === 22 || lifePath === 33) {
      return lifePath.toString();
    }
    
    // Reduce to single digit if not a master number
    return reduceToSingleDigit(lifePath).toString();
  } catch (error) {
    console.error('Error calculating life path number:', error);
    return '0';
  }
}

// Helper function to reduce number to single digit
function reduceToSingleDigit(num: number): number {
  if (num < 10) return num;
  
  const sum = num.toString()
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit), 0);
  
  return reduceToSingleDigit(sum);
}

// Expression/Destiny Number calculation from full name
export function calculateExpression(fullName: string): string {
  try {
    if (!fullName) return '0';
    
    const nameValue = fullName.toLowerCase()
      .replace(/[^a-z]/g, '') // Remove non-letters
      .split('')
      .reduce((sum, letter) => {
        return sum + getLetterValue(letter);
      }, 0);
    
    const expression = reduceToSingleDigit(nameValue);
    
    // Handle master numbers
    if (expression === 11 || expression === 22 || expression === 33) {
      return expression.toString();
    }
    
    return expression.toString();
  } catch (error) {
    console.error('Error calculating expression number:', error);
    return '0';
  }
}

// Letter to number conversion for numerology
function getLetterValue(letter: string): number {
  const values: Record<string, number> = {
    'a': 1, 'j': 1, 's': 1,
    'b': 2, 'k': 2, 't': 2,
    'c': 3, 'l': 3, 'u': 3,
    'd': 4, 'm': 4, 'v': 4,
    'e': 5, 'n': 5, 'w': 5,
    'f': 6, 'o': 6, 'x': 6,
    'g': 7, 'p': 7, 'y': 7,
    'h': 8, 'q': 8, 'z': 8,
    'i': 9, 'r': 9
  };
  
  return values[letter] || 0;
}

// Soul Urge/Heart's Desire Number from vowels
export function calculateSoulUrge(fullName: string): string {
  try {
    if (!fullName) return '0';
    
    const vowelValue = fullName.toLowerCase()
      .split('')
      .reduce((sum, letter) => {
        if ('aeiou'.includes(letter)) {
          return sum + getLetterValue(letter);
        }
        return sum;
      }, 0);
    
    const soulUrge = reduceToSingleDigit(vowelValue);
    
    // Handle master numbers
    if (soulUrge === 11 || soulUrge === 22 || soulUrge === 33) {
      return soulUrge.toString();
    }
    
    return soulUrge.toString();
  } catch (error) {
    console.error('Error calculating soul urge number:', error);
    return '0';
  }
}

// Birthday Number
export function calculateBirthday(birthDate: string): string {
  try {
    const dateStr = birthDate.replace(/\D/g, '');
    if (dateStr.length < 8) return '0';
    
    const day = parseInt(dateStr.substring(2, 4));
    const birthday = reduceToSingleDigit(day);
    
    // Handle master numbers
    if (birthday === 11 || birthday === 22) {
      return birthday.toString();
    }
    
    return birthday.toString();
  } catch (error) {
    console.error('Error calculating birthday number:', error);
    return '0';
  }
}
