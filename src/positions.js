const parseTuning = require('./tuning').parseTuning;
const findFret = require('./semitones').findFret;
const getNoteAbove = require('./semitones').getNoteAbove;

/**
 * Return all positions within the first octave on the fretboard where a set of notes can be played in a given tuning.
 * @param {String[]} notes Notes to be played, e.g. `['E', 'G#', 'B', 'D#']`.
 * @param {string|string[]} [tuning] Array or hyphen-delimited list of notes of the tuning from the lowest (thickest string).
 *                                   Can include octave number after the note.
 *                                   E.g. `'E2-A2-D3-G3-B3-E4'` or `['D','A','D','F#','A','D']`.
 *                                   Without octaves, starts from octave `2`.
 * @returns {Object[]} Positions in format `{ stringIndex: Number, fret: Number, note: String }`.
 */
function findPositions(notes, tuning = 'E-A-D-G-B-E') {
  tuning = parseTuning(tuning);
  let positions = [];
  for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
    let stringNote = tuning[stringIndex];
    for (let k = 0; k < notes.length; k++) {
      let note = notes[k];
      let fret = findFret(note, stringNote);
      positions.push({ stringNote, stringIndex, fret, note: getNoteAbove(note, stringNote) });
    }
  }
  return positions;
}

module.exports = {
  findPositions,
};