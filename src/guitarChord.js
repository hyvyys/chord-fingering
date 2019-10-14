const findChord = require('./chord').findChord;
const findFingerings = require('./fingerings').findFingerings;

/**
 * Find intervals, corresponding notes, and possible fingerings for a given chord symbol and tuning.
 * @param {string} symbol Chord symbol, e.g. `'C'`, `'Dm'`, `'Ebmaj7'`, `'C#11b13'`.
 * @param {string|string[]} [tuning] Array or hyphen-delimited list of notes of the tuning from the lowest (thickest string).
 *                                   Can include octave number after the note.
 *                                   E.g. `'E2-A2-D3-G3-B3-E4'` or `['D','A','D','F#','A','D']`.
 *                                   Without octaves, starts from octave `2`.
 * @returns {object} Chord data in format `{ symbol, intervals, optionalIntervals, requiredIntervals, tonic, notes, optionalNotes, requiredNotes, bass, description, fullName, fingerings }`.
 *                   Fingerings are in format `{ positions: [ { stringIndex: Number, fret: Number, note: String } ] }`, with muted strings omitted.
 */
function findGuitarChord(symbol, tuning, caseSensitive = true) {
  const chord = findChord(symbol, caseSensitive);
  if (chord) {
    const { notes, optionalNotes, bass } = chord;
    const fingerings = findFingerings(notes, optionalNotes, bass, tuning);
    return {
      ...chord,
      fingerings,
    };
  }
  return null;
}

module.exports = {
  findGuitarChord,
};