const findGuitarChord = require('./guitarChord').findGuitarChord;

describe('findGuitarChord', () => {
  it('finds F major', () => {
    const chord = findGuitarChord('F');
    expect(chord).not.toBeNull();
    const fields = [
      'symbol', 'intervals', 'optionalIntervals', 'requiredIntervals', 'tonic',
      'notes', 'optionalNotes', 'requiredNotes', 'bass', 'description',
    ];
    fields.forEach(f => {
      expect(chord[f]).toBeDefined();
    });
    expect(chord.notes).toEqual(['F', 'A', 'C']);
  });
});