const findPositions = require('./positions').findPositions;

describe('positions', () => {
  // tuning = 'E-A-D-G-B-E' = 'E2-A2-D3-G3-B3-E4' = default
  {
    const notes = [ 'E' ];
    const received = findPositions(notes);
    const expected = [
      { stringIndex: 0, fret: 0, note: 'E2' },
      { stringIndex: 1, fret: 7, note: 'E3' },
      { stringIndex: 2, fret: 2, note: 'E3' },
      { stringIndex: 3, fret: 9, note: 'E4' },
      { stringIndex: 4, fret: 5, note: 'E4' },
      { stringIndex: 5, fret: 0, note: 'E4' },
    ];
    
    it('returns correct number of positions for note E', () => {
      expect(received.length).toBe(expected.length);
    });
    
    expected.forEach(ep => {
      const matching = received.find(rp => rp.stringIndex === ep.stringIndex && rp.fret === ep.fret);
      it(`returns position on string ${ep.stringIndex} on fret ${ep.fret} for note ${ep.note }`, () => {
        expect(matching.note).toBe(ep.note);
      });
    });
  }
  
  {
    const notes = [ 'E#' ];
    const received = findPositions(notes);
    const expected = [
      { stringIndex: 0, fret: 1, note: 'E#2' },
      { stringIndex: 1, fret: 8, note: 'E#3' },
      { stringIndex: 2, fret: 3, note: 'E#3' },
      { stringIndex: 3, fret: 10, note: 'E#4' },
      { stringIndex: 4, fret: 6, note: 'E#4' },
      { stringIndex: 5, fret: 1, note: 'E#4' },
    ];
    
    it('returns correct number of positions for note E#', () => {
      expect(received.length).toBe(expected.length);
    });
    
    expected.forEach(ep => {
      const matching = received.find(rp => rp.stringIndex === ep.stringIndex && rp.fret === ep.fret);
      it(`returns position on string ${ep.stringIndex} on fret ${ep.fret} for note ${ep.note }`, () => {
        expect(matching.note).toBe(ep.note);
      });
    });
  }

  // const notes = [ 'E', 'G#', 'B' ];
  // const expected = [
  //   { stringIndex: 0, fret: 0, note: 'E2' },
  //   { stringIndex: 1, fret: 7, note: 'E3' },
  //   { stringIndex: 2, fret: 2, note: 'E3' },
  //   { stringIndex: 3, fret: 9, note: 'E4' },
  //   { stringIndex: 4, fret: 5, note: 'E4' },
  //   { stringIndex: 5, fret: 0, note: 'E4' },
  //   { stringIndex: 0, fret: 4, note: 'G#2' },
  //   { stringIndex: 1, fret: 11, note: 'G#3' },
  //   { stringIndex: 2, fret: 6, note: 'G#3' },
  //   { stringIndex: 3, fret: 1, note: 'G#3' },
  //   { stringIndex: 4, fret: 9, note: 'G#4' },
  //   { stringIndex: 5, fret: 4, note: 'G#4' },
  //   { stringIndex: 0, fret: 7, note: 'B2' },
  //   { stringIndex: 1, fret: 2, note: 'B2' },
  //   { stringIndex: 2, fret: 9, note: 'B3' },
  //   { stringIndex: 3, fret: 4, note: 'B3' },
  //   { stringIndex: 4, fret: 0, note: 'B3' },
  //   { stringIndex: 5, fret: 7, note: 'B4' },
  // ];
});