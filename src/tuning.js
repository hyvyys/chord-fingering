const getOctave = require('./semitones').getOctave;
const getNoteAbove = require('./semitones').getNoteAbove;

function parseTuning(arg) {
  if (typeof arg === 'string') {
    arg = arg.split('-');
  }
  
  let lastNote = arg[0];
  let octave = getOctave(lastNote);
  if (octave == null) lastNote = lastNote + 2;
  const tuning = arg.map((note) => {
    lastNote = getNoteAbove(note, lastNote);
    return lastNote;
  });
  return tuning;
}

module.exports = {
  parseTuning,
};
