export function processScript(text: string): string {
  if (!text) return "";

  const lines = text.split('\n');
  const result: string[] = [];
  let currentMode: 'narration' | 'broll' | 'neutral' = 'neutral';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmedBase = line.trim();
    const lowerLine = line.toLowerCase().trim();

    // Regex to match markers like "B-roll:", "**B-roll:**", "Broll : ", etc.
    const brollRegex = /^[\*\_]*\s*(b-roll|b roll|broll)\s*[\*\_]*\s*:/i;
    // Regex to match "Narration:", "Narattion:", "**Narration:**", etc.
    const narrationRegex = /^[\*\_]*\s*(narration|narattion|narrator)\s*[\*\_]*\s*:/i;

    if (brollRegex.test(lowerLine)) {
      currentMode = 'broll';
      continue; // Skip the B-roll marker line
    }

    if (narrationRegex.test(lowerLine)) {
      currentMode = 'narration';
      // Strip out the "Narration:" label and keep the remaining text on that line (if any)
      const cleanLine = line.replace(/^[\*\_]*\s*(narration|narattion|narrator)\s*[\*\_]*\s*:\s*/i, '');
      if (cleanLine.trim() !== '') {
        result.push(cleanLine.trim());
      }
      continue;
    }

    // Pass through empty lines, collapsing multiple empty lines into single breaks
    if (trimmedBase === '') {
      if (result.length > 0 && result[result.length - 1] !== '') {
        result.push('');
      }
      continue;
    }

    // Include the line if we are not explicitly inside a B-roll chunk
    if (currentMode !== 'broll') {
      result.push(trimmedBase);
    }
  }

  // Final cleanup of any trailing/excessive whitespace
  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function getStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  return { words, chars };
}
