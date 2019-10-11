const findFingerings = require('./fingerings').findFingerings;

function arePositionsEqual(a, b) {
  return a.stringIndex === b.stringIndex && a.fret === b.fret && a.note === b.note;
}

function areFingeringsEqual(a, b) {
  return a.every((p, i) => arePositionsEqual(b[i], p));
}

describe('fingerings', () => {
  it('works for E major', () => {
    const notes = [ 'E', 'G#', 'B' ];
    const expectedPositions = [
      { stringIndex: 0, fret: 0, note: 'E2' },
      { stringIndex: 1, fret: 2, note: 'B2' },
      { stringIndex: 2, fret: 2, note: 'E3' },
      { stringIndex: 3, fret: 1, note: 'G#3' },
      { stringIndex: 4, fret: 0, note: 'B3' },
      { stringIndex: 5, fret: 0, note: 'E4' },
    ];
    
    const fingerings = findFingerings(notes);
    const matching = fingerings.find(f => areFingeringsEqual(expectedPositions, f.positions));
    expect(matching).toBeTruthy();
  });

  it('works for C6', () => {
    const notes = [ 'C', 'E', 'G', 'A' ];
    const optionalNotes = [ 'G' ];
    const expectedPositions = [
      { stringIndex: 1, fret: 3, note: 'C3' },
      { stringIndex: 2, fret: 2, note: 'E3' },
      { stringIndex: 3, fret: 2, note: 'A3' },
      { stringIndex: 4, fret: 1, note: 'C4' },
      { stringIndex: 5, fret: 0, note: 'E4' },
    ];
    
    const fingerings = findFingerings(notes, optionalNotes);
    const matching = fingerings.find(f => areFingeringsEqual(expectedPositions, f.positions));
    expect(matching).toBeTruthy();
  });

  it('works for Amaj7sus2', () => {
    const notes = [ 'A', 'B', 'E', 'G#' ];
    const expectedPositions = [
      { stringIndex: 1, fret: 0, note: 'A2' },
      { stringIndex: 2, fret: 2, note: 'E3' },
      { stringIndex: 3, fret: 1, note: 'G#3' },
      { stringIndex: 4, fret: 0, note: 'B3' },
      { stringIndex: 5, fret: 0, note: 'E4' },
    ];
    
    const fingerings = findFingerings(notes);
    const matching = fingerings.find(f => areFingeringsEqual(expectedPositions, f.positions));
    expect(matching).toBeTruthy();
  });

  it('works for D/F#', () => {
    const notes = [ 'D', 'F#', 'A' ];
    const bass = 'F#';
    const expectedPositions = [
      { stringIndex: 0, fret: 2, note: 'F#2' },
      { stringIndex: 1, fret: 0, note: 'A2' },
      { stringIndex: 2, fret: 0, note: 'D3' },
      { stringIndex: 3, fret: 2, note: 'A3' },
      { stringIndex: 4, fret: 3, note: 'D4' },
      { stringIndex: 5, fret: 2, note: 'F#4' },
    ];
    
    const fingerings = findFingerings(notes, [], bass);
    const matching = fingerings.find(f => areFingeringsEqual(expectedPositions, f.positions));
    expect(matching).toBeTruthy();
  });

  it('works for Am', () => {
    const notes = [ 'A', 'C', 'E' ];
    const expectedPositions = [
      { stringIndex: 1, fret: 0, note: 'A2' },
      { stringIndex: 2, fret: 2, note: 'E3' },
      { stringIndex: 3, fret: 2, note: 'A3' },
      { stringIndex: 4, fret: 1, note: 'C4' },
      { stringIndex: 5, fret: 0, note: 'E4' },
    ];
    
    const fingerings = findFingerings(notes);
    const matching = fingerings.find(f => areFingeringsEqual(expectedPositions, f.positions));
    expect(matching).toBeTruthy();
  });

  it('works for C#', () => {
    const notes = [ 'C#', 'E#', 'G#' ];
    const expectedPositions = [
      { stringIndex: 1, fret: 4, note: 'C#3' },
      { stringIndex: 2, fret: 6, note: 'G#3' },
      { stringIndex: 3, fret: 6, note: 'C#4' },
      { stringIndex: 4, fret: 6, note: 'E#4' },
      { stringIndex: 5, fret: 4, note: 'G#4' },
    ];
    
    const fingerings = findFingerings(notes);
    const matching = fingerings.find(f => areFingeringsEqual(expectedPositions, f.positions));
    expect(matching).toBeTruthy();
  });

  // it('sort fingerings correctly', () => {
  //   const expectedPositions = [
  //     { stringIndex: 1, fret: 0, note: 'A' },
  //     { stringIndex: 2, fret: 2, note: 'E' },
  //     { stringIndex: 3, fret: 2, note: 'A' },
  //     { stringIndex: 4, fret: 1, note: 'C' },
  //     { stringIndex: 5, fret: 0, note: 'E' },
  //   ];
    
  //   const fingerings = findFingerings(notes);
  //   const matching = fingerings.find(f => areFingeringsEqual(expectedPositions, f.positions));
  //   expect(matching).toBeTruthy();
  // });
});