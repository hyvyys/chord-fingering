const matchAll = require('string.prototype.matchall');
matchAll.shim();
const CHORD_DATA = require('./CHORD_DATA').CHORD_DATA;
const tonal = require('@tonaljs/tonal');

/**
 * Find intervals and corresponding notes for a given chord symbol.
 * @param {string} symbol Chord symbol, e.g. `'C'`, `'Dm'`, `'Ebmaj7'`, `'C#11b13'`.
 * @returns {object} Chord data in format `{ symbol, intervals, optionalIntervals, requiredIntervals, tonic,
 *                   notes, optionalNotes, requiredNotes, bass, description }`.
 */
function findChord(symbol) {
  let invertedRootRegex = /\/([A-G][#b]?)$/;
  let matches = symbol.match(invertedRootRegex);
  let invertedRoot = matches ? matches[1] : null;
  const baseSymbol = symbol.replace(invertedRootRegex, '');
  
  matches = [...baseSymbol.matchAll(/^([A-G][#b]?)(.*)$/g)];
  if (!matches.length) return null;
  let [, tonic, chordType] = matches[0];
  
  const entry = CHORD_DATA.find(e => e.symbols.includes(chordType));
  if (!entry) return null;
  const { description, intervals, optionalIntervals } = entry;
  const requiredIntervals = intervals.filter(n => !optionalIntervals.includes(n));
  const notes = intervals.map(i => tonal.transpose(tonic, i));
  const optionalNotes = optionalIntervals.map(i => tonal.transpose(tonic, i));
  const requiredNotes = notes.filter(n => !optionalNotes.includes(n));

  let bass = tonic;
  if (invertedRoot) {
    bass = invertedRoot;
    if (!notes.includes(invertedRoot)) {
      notes.push(invertedRoot);
    }
  }

  const chord = {
    symbol,
    intervals,
    optionalIntervals,
    requiredIntervals,
    tonic,
    notes,
    optionalNotes,
    requiredNotes,
    bass,
    description,
  };

  return chord;
}

module.exports = {
  findChord,
};