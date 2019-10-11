const parseTuning = require('./tuning').parseTuning;

describe('parseTuning', () => {
  it('parses standard tuning', () => {
    const tuning = parseTuning('E-A-D-G-B-e');
    expect(tuning).toEqual(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
  });
});