const getOctave = require('./semitones').getOctave;
const getNoteAbove = require('./semitones').getNoteAbove;

function capitalize(s) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

/**
 * Deduces tuning from a string.
 * @param {string|string[]} arg Array or hyphen-delimited list of notes of the tuning from the lowest (thickest string).
 *                              Can include octave number after the note.
 *                              E.g. `'E-A-D-G-B-e'`, `'E2-A2-D3-G3-B3-E4'` or `['D','A','D','F#','A','D']`.
 *                              By default, starts from octave `2`.
 * @returns {string[]} Array of note pitches (with octave numbers) comprising the tuning, e.g. `['D2','A2','D3','F#3','A3','D4']`.
 */
function parseTuning(arg) {
  if (typeof arg === 'string') {
    arg = arg.split('-');
  }
  
  let lastNote = arg[0];
  let octave = getOctave(lastNote);
  if (octave == null) lastNote = lastNote + 2;
  const tuning = arg.map((note) => {
    note = capitalize(note);
    let octave = getOctave(note);
    if (octave == null)
      note = getNoteAbove(note, lastNote);
    lastNote = note;
    return note;
  });
  return tuning;
}

module.exports = {
  parseTuning,
};
