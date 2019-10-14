const parseTuning = require('./tuning').parseTuning;

describe('parseTuning', () => {
  it('parses standard tuning', () => {
    const tuning = parseTuning('E-A-D-G-B-e');
    expect(tuning).toEqual(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
  });
  it('parses tuning with octaves', () => {
    const tuning = parseTuning('D1-A2-D3-G4-B3-e5');
    expect(tuning).toEqual(['D1', 'A2', 'D3', 'G4', 'B3', 'E5']);
  });
  it('parses array tuning', () => {
    const tuning = parseTuning(['D','A','D','F#','A','D']);
    expect(tuning).toEqual(['D2','A2','D3','F#3','A3','D4']);
  });
  it('parses array tuning with octaves', () => {
    const tuning = parseTuning(['D2','A2','D3','G3','C4','E4']);
    expect(tuning).toEqual(['D2','A2','D3','G3','C4','E4']);
  });
});