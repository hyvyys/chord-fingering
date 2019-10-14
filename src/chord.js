const matchAll = require('string.prototype.matchall');
matchAll.shim();
const CHORD_DATA = require('./CHORD_DATA').CHORD_DATA;
const tonal = require('@tonaljs/tonal');

function capitalize(s) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

/**
 * Find intervals and corresponding notes for a given chord symbol.
 * @param {string} symbol Chord symbol, e.g. `'C'`, `'Dm'`, `'Ebmaj7'`, `'C#11b13'`.
 * @returns {object} Chord data in format `{ symbol, intervals, optionalIntervals, requiredIntervals, tonic,
 *                   notes, optionalNotes, requiredNotes, bass, description }`.
 */
function findChord(symbol, caseSensitive = true) {
  let invertedRootRegex = caseSensitive ? /\/([A-G][#b]?)$/ : /\/([A-G][#b]?)$/i;
  let matches = symbol.match(invertedRootRegex);
  let invertedRoot = matches ? matches[1] : null;
  const baseSymbol = symbol.replace(invertedRootRegex, '');
  
  let tokensRegex = caseSensitive ? /^([A-G][#b]?)(.*)$/g : /^([A-G][#b]?)(.*)$/ig;
  matches = [...baseSymbol.matchAll(tokensRegex)];
  if (!matches.length) return null;
  let [, tonic, chordType] = matches[0];
  tonic = capitalize(tonic);
  
  let entry = CHORD_DATA.find(e => e.symbols.includes(chordType));
  if (!entry)
    entry = CHORD_DATA.find(e => e.altSymbols.includes(chordType));
  if (!entry) return null;
  const { description, intervals, optionalIntervals, symbols, altSymbols } = entry;
  const requiredIntervals = intervals.filter(n => !optionalIntervals.includes(n));
  const notes = intervals.map(i => tonal.transpose(tonic, i));
  const optionalNotes = optionalIntervals.map(i => tonal.transpose(tonic, i));
  const requiredNotes = notes.filter(n => !optionalNotes.includes(n));

  let bass = tonic;
  if (invertedRoot) {
    bass = capitalize(invertedRoot);
    if (!notes.includes(invertedRoot)) {
      notes.push(invertedRoot);
    }
  }

  invertedRoot = (invertedRoot ? ('/' + bass) : '');
  const aliases = symbols.map(s => tonic + s + invertedRoot);
  const altAliases = altSymbols.map(s => tonic + s + invertedRoot);
  const name = aliases.length ? aliases[0] : altAliases[0];

  const chord = {
    input: symbol,
    symbol: name,
    symbols: aliases,
    altSymbols: altAliases,
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