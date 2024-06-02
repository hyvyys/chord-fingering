const tonal = require('@tonaljs/tonal');
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

function pressedNonBarreFrets(fingering) {
  return pressedFrets(fingering).filter(fret => !fingering.barre || fret !== fingering.barre.fret);
}

function minFret(a) { return Math.min(...pressedFrets(a)); }

function maxFret(a) { return Math.max(...pressedFrets(a)); }

function getFretRange(a) { return maxFret(a) - minFret(a); }

function getFretRangeWithMin(a, n) { return Math.max(n, getFretRange(a)); }

function bassOctave(a) { return getOctave(a.positions[0].note); }

function getBassFret(f) {
  return f.positions[0].fret;
}

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

function computeDifficulty(f, barrePenalty = 5) {
  let consideredPositions = f.positions.filter(p =>
    p.fret > 0
    && (!f.barre
    || p.stringIndex === f.barre.stringIndices.slice(-1)[0]
    || p.fret !== f.barre.fret)
  );
  if (consideredPositions.length === 0)
    consideredPositions = f.positions;
  const a = consideredPositions.map(p => p.fret);
  
  function distFromNut(fret) {
    // 65cm = classical guitar scale length
    return 65 - 65 / (2 ** (fret / 12)); // 3.64cm first fret
  }
  const fretDistances = a.slice(1).map((f1, i) => {
    const f2 = a[i];
    const d1 = distFromNut(f1), d2 = distFromNut(f2);
    return Math.abs(f1 - f2) > 1
      ? Math.abs(d1 - d2)
      : Math.abs(d1 - d2);
  });

  function transform(d) {
    // return d;
    return Math.pow(d, 1.1);
    // return Math.max(distFromNut(2), d);
    // return Math.pow(Math.max(0, d - 1) + 1, 2);
  }
  const fretDistanceDifficulty = fretDistances.reduce((acc, d) => acc + transform(d), 0); // for barre only chords
  
  const difficulty = Math.max(0,
    fretDistanceDifficulty
    + (f.barre ? barrePenalty : 0)
    + (consideredPositions.length <= 3 ? -3 : 0)
  );
  function normalize(d) {
    return Math.round(d * 100) / 100;
  }
  return normalize(difficulty); 
}

function anatomicalShape(f) {
  if (getFretRange(f) >= 3 && !f.barre) {
    const min = minFret(f);
    const atMin = f.positions.filter(p => p.fret === min).map(p => p.stringIndex);
    const max = maxFret(f);
    const atMax = f.positions.filter(p => p.fret === max).map(p => p.stringIndex);
    // const a = Math.min(...atMin), b = Math.max(...atMin);
    if (atMin.length + atMax.length === HUMAN_LEFT_HAND_PLAYING_FINGERS)
      return false;
  }
  return true;
}

function mutedStringsBetween (f, tuning) {
  const minString = f.positions[0].stringIndex;
  const maxString = f.positions.slice(-1)[0].stringIndex;
  const strummedStrings = tuning.map((s, i) => i).slice(minString, maxString + 1);
  const mutedStrummedStrings = strummedStrings.filter(i => !f.positions.find(p => p.stringIndex === i));
  return mutedStrummedStrings.length;
}

function distinctNotesRatio(f) {
  const distinctNotes = f.positions.map(p => p.note).filter((n, i, a) => a.indexOf(n) === i);
  return distinctNotes.length / f.positions.length;
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
  let originalTuning = tuning;
  let sortedTuning = tuning.slice().sort((a, b) => {
    let i = tonal.interval(tonal.distance(a, b)).semitones;
    return -i;
  });
  tuning = sortedTuning;


  let fingerings = [];
  let positions = findPositions(notes, tuning);
  let isTuningAscending = JSON.stringify(tuning) === JSON.stringify(originalTuning);

  const requiredNotes = notes.slice().filter(n => !optionalNotes.includes(n));
  let maxBassStringIndex = tuning.length - requiredNotes.length;
  if (!requiredNotes.includes(bass)) {
    maxBassStringIndex--;
  }
  let bassPositions = positions;
  if (isTuningAscending) {
    bassPositions = positions
      .filter(p => areNotesEqual(p.note, bass))
      .filter(p => p.stringIndex <= maxBassStringIndex);
  }

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
        let sensiblePositions = reachablePositions;
        if (isTuningAscending) {
          sensiblePositions = reachablePositions.filter(p =>
            tonal.distance(bassPosition.note, p.note)[0] !== '-');
        }
        if (sensiblePositions.length) {
          return sensiblePositions.map(position => [...fingering, position]);
        }
        else {
          return [ fingering ]; // mute this string
        }
      });
    }
    fingerings = [ ...fingerings, ...fingeringsForThisBass ];
  }

  const isChordFull = (f) => requiredNotes.every(note => f.find(position => areNotesEqual(position.note, note)));
  const enoughFingers = (f) => {
    if (!f.barre) {
      return pressedFrets(f).length <= HUMAN_LEFT_HAND_PLAYING_FINGERS;
    }
    else {
      return pressedNonBarreFrets(f).length <= HUMAN_LEFT_HAND_PLAYING_FINGERS - 1;
    }
  };

  function moreThanFourStrings(f) {
    return Math.min(4, f.positions.length);
  }

  fingerings = fingerings
    .filter(isChordFull)
    .map(f => {
      f.forEach(string => string.stringIndex = originalTuning.indexOf(string.stringNote));
      f.sort((a, b) => a.stringIndex - b.stringIndex);
      return f;
    })
    .map(f => ({
      positions: f,
      barre: detectBarre(f),
      positionString: fingeringToString(f, tuning),
    }))
    .filter(enoughFingers)
    .filter(anatomicalShape)
    .map(f => ({
      ...f,
      difficulty: computeDifficulty(f),
    }))
    .map(f => ({
      ...f,
    }))
    .sort((a, b) => {
      // const lowerMinFret = minFret(a) - minFret(b);
      // const moreOpenStrings = - (openStrings(a).length - openStrings(b).length);
      // const smallerFretRange = getFretRangeWithMin(a, 2) - getFretRangeWithMin(b, 2);
      // const lowerBass = bassOctave(a) - bassOctave(b);
      const lessMutedStringsInBetween = mutedStringsBetween(a, tuning) - mutedStringsBetween(b, tuning);
      const notLessThanFourStrings = -(moreThanFourStrings(a) - moreThanFourStrings(b));
      const lessRepeatingNotes = -(distinctNotesRatio(a) - distinctNotesRatio(b));
      const lowerMaxFret = maxFret(a) - maxFret(b);

      function limitDifficulty(f, max) {
        return Math.max(f.difficulty, max);
      }

      const easier = a.difficulty - b.difficulty;
      const easierThan12 = limitDifficulty(a, 12) - limitDifficulty(b, 12);
      // const easierThan8 = limitDifficulty(a, 8) - limitDifficulty(b, 8);
      const easierThan14 = limitDifficulty(a, 14) - limitDifficulty(b, 14);
      const lowerBassFret = getBassFret(a) - getBassFret(b);

      return 0
        || notLessThanFourStrings
        || lessMutedStringsInBetween
        || (isTuningAscending ? 0 : lowerMaxFret)
        || (isTuningAscending ? 0 : easier)
        || lessRepeatingNotes
        || easierThan14
        || lowerBassFret
        || easierThan12
        || (isTuningAscending ? lowerMaxFret : 0)
        || (isTuningAscending ? easier : 0)
        || 0;
    });
  return fingerings;
}

module.exports = {
  findFingerings,
};