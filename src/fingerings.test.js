const findFingerings = require('./fingerings').findFingerings;
const findChord = require('./chord').findChord;

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

  const pos = (s, i) => {
    const c = findChord(s);
    const { notes, optionalNotes } = c;
    return findFingerings(notes, optionalNotes)[i].positionString;
  };
  it('sort C fingerings correctly', () => {
    expect(pos('C', 0)).toBe('x32010');
  });
  it('sort Cm fingerings correctly', () => {
    expect(pos('Cm', 0)).toBe('x35543');
  });
  it('sort C# fingerings correctly', () => {
    expect(pos('C#', 0)).toBe('x46664');
  });

  it('sort D fingerings correctly', () => {
    expect(pos('D', 0)).toBe('xx0232');
  });
  it('sort Dm fingerings correctly', () => {
    expect(pos('Dm', 0)).toBe('xx0231');
  });

  it('sort E fingerings correctly', () => {
    expect(pos('E', 0)).toBe('022100');
  });
  it('sort Em fingerings correctly', () => {
    expect(pos('Em', 0)).toBe('022000');
  });

  it('sort F fingerings correctly', () => {
    expect(pos('F', 0)).toBe('133211');
    expect(pos('F', 1)).toBe('xx3211');
  });
  it('sort Fm fingerings correctly', () => {
    expect(pos('Fm', 0)).toBe('133111');
  });

  it('sort G fingerings correctly', () => {
    expect(pos('G', 0)).toBe('320003');
    expect(pos('G', 1)).toBe('320033');
  });
  it('sort Gm fingerings correctly', () => {
    expect(pos('Gm', 0)).toBe('355333');
  });

  it('sort A fingerings correctly', () => {
    expect(pos('A', 0)).toBe('x02220');
    // expect(pos('A', 1)).toBe('577655');
  });
  it('sort Am fingerings correctly', () => {
    expect(pos('Am', 0)).toBe('x02210');
  });

  it('sort B fingerings correctly', () => {
    expect(pos('B', 0)).toBe('x24442');
    expect(pos('B', 1)).toBe('799877');
  });

  it('sort B7 fingerings correctly', () => {
    expect(pos('B7', 0)).toBe('x21202');
  });
  it('sort Bm fingerings correctly', () => {
    expect(pos('Bm', 0)).toBe('x24432');
  });
});