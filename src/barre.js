
/**
 * Detect barre in a fingering.
 * @param {object[]} positions - Fingering in format `[ { stringIndex: Number, fret: Number } ]`.
 * @param {number} positions[].stringIndex - Zero-based index of the guitar string, starting from lowest (thickest).
 * @param {number} positions[].fret - Zero-based index of the guitar fret.
 * @param {number} [stringCount] - Number of the instrument's strings, defaults to `6`.
 * @returns {object} Barre in format `{ stringIndices: Number[], fret: Number } ] }` or `null`.
 */
function detectBarre(positions, stringCount = 6) {
  const minPressedFret = Math.min(...positions.map(p => p.fret).filter(f => f > 0));
  const openStringIndices = [];
  const barreStringIndices = [];
  for (let i = 0; i < stringCount; i++) {
    const position = positions.find(p => p.stringIndex === i);
    // muted string
    if (!position) {
      continue;
    }
    if (position.fret === 0) {
      // cannot have open strings *below* barre strings
      if (barreStringIndices.length > 0) {
        return null;
      }
      openStringIndices.push(i);
    }
    else if (position.fret === minPressedFret) {
      barreStringIndices.push(i);
    }
  }
  if (barreStringIndices.length > 1) {
    return { fret: minPressedFret, stringIndices: barreStringIndices };
  }
  return null;
}

module.exports = {
  detectBarre,
};