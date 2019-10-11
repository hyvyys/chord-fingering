
const tonal = require('@tonaljs/tonal');
const tonalNote = require('@tonaljs/note');

/**
 * Return note stripped of octave number, e.g. `'C'`.
 * @param {String} note Note with optional octave number, e.g. `'C5'`.
 */
function getNoteValue(note) {
  note = note.replace(/\d+/g, ''); // stripped of octave number
  note = note[0].toUpperCase() + note.slice(1);
  return note;
}

function getOctave (arg, defaultValue) {
  let match = arg.match(/\d+$/);
  return match ? match[0] : defaultValue;
}

function areNotesEqual(a, b) {
  a = getNoteValue(a);
  b = getNoteValue(b);
  return a === b || tonalNote.enharmonic(a) === (b);
}


/**
 * Given two notes, returns the first note with octave number such that it is the lowest note higher or equal than the second.
 * @param {string} note Note, with or without octave number, e.g. `'D'`
 * @param {string} baseNote Base note with octave, e.g. `'G3'`
 * @returns First note with octave number, e.g. `('D', 'G3') => 'D4'`
 */
function getNoteAbove(note, baseNote) {
  let octave = getOctave(baseNote, null);
  if (octave == null) {
    octave = 2;
    baseNote = getNoteValue(baseNote) + octave;
  }
  let noteValue = getNoteValue(note);
  
  let d = tonal.distance(baseNote, noteValue + octave); // => "5P"
  if (d[0] === '-') {
    octave++;
    d = tonal.distance(baseNote, noteValue + octave); // => "5P"
  }
  note = noteValue + octave;
  return note;
}

/**
 * Find the fret number within the first octave on the fretboard where a note can be played on a given string.
 * @param {String} note Higher note (note to be played), e.g. `'G#'`.
 * @param {String} stringNote Lower note (note of the string), e.g. `'E'`.
 * @returns {Number} Number of semitones (fret number), e.g. `4`.
 */
function findFret(note, stringNote) {
  note = getNoteAbove(note, stringNote);
  let distance = tonal.distance(stringNote, note); // => e.g. "5P", "-4P"
  let fret = tonal.interval(distance).semitones; // => 7
  return fret;
}

module.exports = {
  getNoteAbove,
  findFret,
  getNoteValue,
  getOctave,
  areNotesEqual,
};