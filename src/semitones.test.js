const getNoteAbove = require('./semitones').getNoteAbove;
const findFret = require('./semitones').findFret;
const areNotesEqual = require('./semitones').areNotesEqual;

describe('getNoteAbove', () => {
  it('C above D4', () => {
    const note = getNoteAbove('C', 'D4');
    expect(note).toBe('C5');
  });
  it('C above C4', () => {
    const note = getNoteAbove('C', 'C4');
    expect(note).toBe('C4');
  });
  it('C# above C#2', () => {
    const note = getNoteAbove('C#', 'C#2');
    expect(note).toBe('C#2');
  });
});

describe('findFret', () => {
  it('computes semitones from C to G', () => {
    const semitones = findFret('G', 'C');
    expect(semitones).toBe(7);
  });
  it('computes semitones from C# to C#', () => {
    const semitones = findFret('C#', 'C#');
    expect(semitones).toBe(0);
  });
});


describe('areNotesEqual', () => {
  it('C#4, Db1', () => {
    expect(areNotesEqual('C#4', 'Db1')).toBe(true);
  });
});