const detectBarre = require('./barre').detectBarre;

describe('detectBarre', () => {
  it('detects barre in F major', () => {
    const fingering = [
      { stringIndex: 0, fret: 1 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 2, fret: 3 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 4, fret: 1 },
      { stringIndex: 5, fret: 1 },
    ];
    const expectedBarre = { stringIndices: [0,4,5], fret: 1 };
    const actualBarre = detectBarre(fingering);
    expect(actualBarre).toEqual(expectedBarre);
  });

  it('detects no barre in G major', () => {
    const fingering = [
      { stringIndex: 0, fret: 3 },
      { stringIndex: 1, fret: 2 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 3, fret: 0 },
      { stringIndex: 4, fret: 3 },
      { stringIndex: 5, fret: 3 },
    ];
    const actualBarre = detectBarre(fingering);
    expect(actualBarre).toBeNull();
  });

  it('detects no barre in A major', () => {
    const fingering = [
      { stringIndex: 1, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 5, fret: 0 },
    ];
    const actualBarre = detectBarre(fingering);
    expect(actualBarre).toBeNull();
  });
});