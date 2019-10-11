const flatMap = require('array.prototype.flatmap');
flatMap.shim();
const findPositions = require('./positions').findPositions;
const detectBarre = require('./barre').detectBarre;
const parseTuning = require('./tuning').parseTuning;
const areNotesEqual = require('./semitones').areNotesEqual;
const getOctave = require('./semitones').getOctave;

const MAX_FRET_DISTANCE = 3; 
const HUMAN_LEFT_HAND_PLAYING_FINGERS = 4;

function pressedFrets(fingering) {
  return fingering.positions.filter(p => p.fret > 0).map(({fret}) => fret);
}

function minFret(a) { return Math.min(...pressedFrets(a)); }

function maxFret(a) { return Math.max(...pressedFrets(a)); }

function fretRange(a) { return maxFret(a) - minFret(a); }

function fretRangeWithMin(a, n) { return Math.max(n, fretRange(a)); }

function bassOctave(a) { return getOctave(a.positions[0].note); }


function openStrings(fingering) {
  return fingering.positions.filter(p => p.fret === 0).map(({stringIndex}) => stringIndex);
}

function fingeringToString(positions, tuning) {
  tuning = parseTuning(tuning);
  const frets = tuning.map((t, i) => {
    const position = positions.find(p => p.stringIndex === i);
    return position != null ? position.fret : 'x';
  });
  return frets.join(frets.some(f => f > 9) ? '-' : '');
}

/**
 * Return all positions within the first octave on the fretboard where a set of notes can be played in a given tuning.
 * @param {string[]} notes Notes to be played, e.g. `['E', 'G#', 'B', 'D#']`.
 * @param {string[]} [optionalNotes] Notes that can be omitted for ease of playing, typically the fifth in an extended chord.
 * @param {string} [bass] The lowest note in the chord, if other than the first of `notes` (typically for chord inversions).
 * @param {string|string[]} [tuning] Array or hyphen-delimited list of notes of the tuning from the lowest (thickest string).
 *                                   Can include octave number after the note.
 *                                   E.g. `'E2-A2-D3-G3-B3-E4'` or `['D','A','D','F#','A','D']`.
 *                                   Without octaves, starts from octave `2`.
 * @returns {object} Fingerings in format `{ positions: [ { stringIndex: Number, fret: Number, note: String } ] }`.
 * Muted strings are omitted.
 */
function findFingerings(notes, optionalNotes = [], bass = notes[0], tuning = 'E-A-D-G-B-E') {
  tuning = parseTuning(tuning);
  let fingerings = [];
  let positions = findPositions(notes, tuning);

  const requiredNotes = notes.slice().filter(n => !optionalNotes.includes(n));
  let maxBassStringIndex = tuning.length - requiredNotes.length;
  if (!requiredNotes.includes(bass)) {
    maxBassStringIndex--;
  }
  let bassPositions = positions
    .filter(p => areNotesEqual(p.note, bass))
    .filter(p => p.stringIndex <= maxBassStringIndex);

  for (let i = 0; i < bassPositions.length; i++) {
    let bassPosition = bassPositions[i];
    let stringIndices = tuning.map((s, i) => i).slice(bassPosition.stringIndex + 1);
    let fingeringsForThisBass = [ [ bassPosition ] ];

    for (let j = 0; j < stringIndices.length; j++) {
      let stringIndex = stringIndices[j];
      let stringPositions = positions.filter(p => p.stringIndex === stringIndex);

      fingeringsForThisBass = fingeringsForThisBass.flatMap(fingering => {
        const reachablePositions = stringPositions.filter(position => {
          const nonZeroFrets = fingering.map(({ fret }) => fret).filter(fret => fret !== 0);
          return position.fret === 0 ||
            nonZeroFrets.every(fret => Math.abs(position.fret - fret) <= MAX_FRET_DISTANCE);
        });

        if (reachablePositions.length) {
          return reachablePositions.map(position => [...fingering, position]);
        }
        else {
          return [ fingering ]; // mute this string
        }
      });
    }
    fingerings = [ ...fingerings, ...fingeringsForThisBass ];
  }

  fingerings = fingerings
    .filter(f => 
      requiredNotes.every(note => f.find(position => areNotesEqual(position.note, note)))
    )
    .map(f => ({
      positions: f,
      barre: detectBarre(f),
      positionString: fingeringToString(f, tuning),
    }))
    .filter(f => {
      if (!f.barre) {
        return pressedFrets(f).length <= HUMAN_LEFT_HAND_PLAYING_FINGERS;
      }
      else {
        const nonBarrePositions = f.positions.filter(p => p.fret !== f.barre.fret);
        return nonBarrePositions.length <= HUMAN_LEFT_HAND_PLAYING_FINGERS - 1;
      }
    })
    .sort((a, b) => {
      const lowerMinFret = minFret(a) - minFret(b);
      const lowerMaxFret = maxFret(a) - maxFret(b);
      const moreOpenStrings = - (openStrings(a).length - openStrings(b).length);
      const smallerFretRange = fretRangeWithMin(a, 2) - fretRangeWithMin(b, 2);
      const lowerBass = bassOctave(a) - bassOctave(b);

      return 0
        || smallerFretRange
        || lowerBass
        || lowerMinFret
        || moreOpenStrings
        || lowerMaxFret
        || 0;
    });
  return fingerings;
}

module.exports = {
  findFingerings,
};