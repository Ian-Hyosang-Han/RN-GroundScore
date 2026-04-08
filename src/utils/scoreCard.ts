export function createHoleNumbers(holes: 9 | 18): number[] {
  return Array.from({ length: holes }, (_, index) => index + 1);
}

export function getHoleStrokes(on: number, putt: number) {
  return on + putt;
}

export function getHoleScoreDiff(par: number, on: number, putt: number) {
  return on + putt - par;
}

export function getScoreLabel(diff: number) {
  if (diff <= -3) return 'Albatross';
  if (diff === -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double Bogey';
  return 'Triple Bogey+';
}

export function getScoreColors(diff: number) {
  if (diff <= -2) {
    return {
      bg: '#0f766e',
      text: '#ffffff',
      border: '#115e59',
    };
  }

  if (diff === -1) {
    return {
      bg: '#16a34a',
      text: '#ffffff',
      border: '#15803d',
    };
  }

  if (diff === 0) {
    return {
      bg: '#f3f4f6',
      text: '#111827',
      border: '#d1d5db',
    };
  }

  if (diff === 1) {
    return {
      bg: '#f59e0b',
      text: '#ffffff',
      border: '#d97706',
    };
  }

  if (diff === 2) {
    return {
      bg: '#ef4444',
      text: '#ffffff',
      border: '#dc2626',
    };
  }

  return {
    bg: '#7f1d1d',
    text: '#ffffff',
    border: '#991b1b',
  };
}

export function sumRange(values: number[], start: number, end: number) {
  return values.slice(start, end).reduce((sum, value) => sum + value, 0);
}

export function getTotalStrokes(
  on: number[],
  putt: number[],
  start: number,
  end: number
) {
  let total = 0;

  for (let i = start; i < end; i += 1) {
    total += (on[i] ?? 0) + (putt[i] ?? 0);
  }

  return total;
}

export function getTotalScoreDiff(
  par: number[],
  on: number[],
  putt: number[],
  start: number,
  end: number
) {
  let total = 0;

  for (let i = start; i < end; i += 1) {
    total += (on[i] ?? 0) + (putt[i] ?? 0) - (par[i] ?? 0);
  }

  return total;
}

export function getGroupTotalScore(
  scores: number[],
  start: number,
  end: number
) {
  return scores.slice(start, end).reduce((sum, value) => sum + value, 0);
}

export function getGroupScoreDiff(
  par: number[],
  scores: number[],
  start: number,
  end: number
) {
  let total = 0;

  for (let i = start; i < end; i += 1) {
    total += (scores[i] ?? 0) - (par[i] ?? 0);
  }

  return total;
}