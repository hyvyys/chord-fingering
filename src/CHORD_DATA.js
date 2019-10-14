function parseData(data) {
  const dictionary = data.map(entry => {
    let [ intervals, optionalIntervals, symbols, altSymbols, description ] = entry;
    intervals = intervals.split(' ');
    optionalIntervals = optionalIntervals.split(' ').filter(i => i);
    symbols = symbols.split(' '); // including empty for major
    altSymbols = altSymbols.split(' ').filter(s => s);
    return { intervals, optionalIntervals, symbols, altSymbols, description };
  });
  return dictionary;
}

/**
 * Source: modified compilation from https://github.com/tonaljs/tonal + own additions
 *   https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
 * Format: `[ intervals, optionalIntervals, symbols, altSymbols, description ]`
 *   `optionalIntervals` - can be skipped when computing fingerings
 *   `symbols` - honored and parsed by UltimateGuitar.com
 *   `altSymbols` - unrecognized by UG, found in the TonalJS source; can be used for searching
 * Entries with empty `symbols`: no symbol recognized by UG was found, but that does not mean one exists.
 **/
const CHORD_DATA = [
  ['1P 3M 5P', '', '', '', 'major'],
  ['1P 3M 5P 7M', '', 'maj7 ma7 M7 Maj7', 'Δ', 'major seventh'],
  ['1P 3M 5P 7M 9M', '', 'maj9', 'Δ9', 'major ninth'],
  ['1P 3M 5P 7M 9M 13M', '', 'maj13', 'Maj13', 'major thirteenth'],
  ['1P 3M 5P 6M', '5P', '6 add6 add13', 'M6', 'sixth'],
  ['1P 3M 5P 6M 9M', '', '6/9', '69', 'sixth/ninth'],
  ['1P 3M 5P 7M 11A', '3M', 'maj7#11', 'maj#4 Δ#4 Δ#11', 'lydian'],
  ['1P 3M 6m 7M', '', 'maj7b13', 'maj7b6 M7b6', 'major seventh b6'],
  ['1P 3m 5P', '', 'm min', 'mi -', 'minor'],
  ['1P 3m 5P 7m', '', 'm7 min7', 'mi7 -7', 'minor seventh'],
  ['1P 3m 5P 7M', '', 'mmaj7 mM7', 'm/ma7 m/maj7 m/M7 -Δ7 mΔ', 'minor/major seventh'],
  ['1P 3m 5P 6M', '5P', 'm6', '', 'minor sixth'],
  ['1P 3m 5P 7m 9M', '3m 5P', 'm9', '', 'minor ninth'],
  ['1P 3m 5P 7m 9M 11P', '5P', 'm11', '', 'minor eleventh'],
  ['1P 3m 5P 7m 9M 13M', '3m 5P', 'm13', '', 'minor thirteenth'],
  ['1P 3m 5d', '', 'dim', '° o', 'diminished'],
  ['1P 3m 5d 7d', '', 'dim7', '°7 o7', 'diminished seventh'],
  ['1P 3m 5d 7m', '', 'm7b5', 'ø', 'half-diminished'],
  ['1P 3M 5P 7m', '', '7', 'dom', 'dominant seventh'],
  ['1P 3M 5P 7m 9M', '5P', '9', '', 'dominant ninth'],
  ['1P 3M 5P 7m 9M 13M', '3M 5P', '13', '', 'dominant thirteenth'],
  ['1P 3M 5P 7m 11A', '3M', '7#11', '7#4', 'lydian dominant seventh'],
  ['1P 3M 5P 7m 9m', '5P', '7b9', '', 'dominant b9'],
  ['1P 3M 5P 7m 9A', '5P', '7#9', '', 'dominant #9'],
  ['1P 3M 7m 9m', '', '', 'alt7', 'altered'],
  ['1P 4P 5P', '', 'sus4', 'sus', 'suspended 4th'],
  ['1P 2M 5P', '', 'sus2', '', 'suspended 2nd'],
  ['1P 4P 5P 7m', '', '7sus4', '', 'suspended 4th seventh'],
  ['1P 5P 7m 9M 11P', '', '11', '', 'eleventh'],
  ['1P 4P 5P 7m 9m', '', '', 'sus4b9 susb9 (b9)sus phryg', 'suspended 4th b9'],
  ['1P 5P', '', '5', '', 'fifth'],
  ['1P 3M 5A', '', 'aug + +5', '', 'augmented'],
  ['1P 3M 5A 7M', '', 'maj7#5 maj7+5', '', 'augmented seventh'],
  ['1P 3M 5P 7M 9M 11A', '9M', 'maj9#11', 'Δ9#11', 'major #11 (lydian)'],
  ['1P 3M 5P 7m 9A', '', '7#9', '', 'dominant #9'],
  ['1P 2M 4P 5P', '', '', 'sus24 sus4add9 sus2sus4', ''],
  ['1P 3M 5A 7M 9M', '', '9#5', 'maj9#5 Maj9#5', ''],
  ['1P 3M 5A 7m', '', '7#5', '+7 7aug aug7', ''],
  ['1P 3M 5A 7m 9A', '', '7#5#9', '7alt 7#5#9_ 7#9b13_', ''],
  ['1P 3M 5A 7m 9M', '', '9#5', '9+', ''],
  ['1P 3M 5A 7m 9M 11A', '', '', '9#5#11', ''],
  ['1P 3M 5A 7m 9m', '', '', '7#5b9', ''],
  ['1P 3M 5A 7m 9m 11A', '', '', '7#5b9#11', ''],
  ['1P 3M 5A 9A', '', '', '+add#9', ''],
  ['1P 3M 5A 9M', '', '+9', 'aug9 add9#5 (#5)add9 M#5add9 +add9', ''],
  ['1P 3M 5P 6M 11A', '', '6#11 maj6#11', 'M6#11 6+11', ''],
  ['1P 3M 5P 6M 7M 9M', '', 'maj7add13', 'M7add13', ''],
  ['1P 3M 5P 6M 9M 11A', '', '', '6/9#11 69#11', ''],
  ['1P 3M 5P 6m 7m', '', '7b13', '7b6', ''],
  ['1P 3M 5P 7M 9A 11A', '', '', 'maj7#9#11 +11', ''],
  ['1P 3M 5P 7M 9M 11A 13M', '', '', ' M13#11 maj13#11 M13+4 M13#4 maj13#4 +11maj13 maj13+11', ''],
  ['1P 3M 5P 7M 9m', '', '', 'maj7b9 M7b9 maj7addb9 maj7-9', ''],
  ['1P 3M 5P 7m 11A 13m', '', '', '7#11b13 7b5b13', ''],
  ['1P 3M 5P 7m 13M', '', '7add6 7add13', '6/7 67', ''],
  ['1P 3M 5P 7m 9A 11A', '', '', '7#9#11 7b5#9', ''],
  ['1P 3M 5P 7m 9A 11A 13M', '', '', '13#9#11', ''],
  ['1P 3M 5P 7m 9A 11A 13m', '', '', '7#9#11b13', ''],
  ['1P 3M 5P 7m 9A 13M', '', '', '13#9 13#9_', ''],
  ['1P 3M 5P 7m 9A 13m', '', '', '7#9b13', ''],
  ['1P 3M 5P 7m 9M 11A', '', '', '9#11 9+4 9#4 9#11_ 9#4_', ''],
  ['1P 3M 5P 7m 9M 11A 13M', '', '', '13#11 13+4 13#4', ''],
  ['1P 3M 5P 7m 9M 11A 13m', '', '', '9#11b13 9b5b13', ''],
  ['1P 3M 5P 7m 9m 11A', '3M 5P', '', '7b5b9 7b9#11', ''],
  ['1P 3M 5P 7m 9m 11A 13M', '', '', '13b9#11', ''],
  ['1P 3M 5P 7m 9m 11A 13m', '', '', '7b9b13#11 7b9#11b13 7b5b9b13', ''],
  ['1P 3M 5P 7m 9m 13M', '', '13b9', '', ''],
  ['1P 3M 5P 7m 9m 13m', '', '', '7b9b13', ''],
  ['1P 3M 5P 7m 9m 9A', '', '', '7b9#9', ''],
  ['1P 3M 5P 9M', '', 'add9 add2 2', 'Madd9', ''],
  ['1P 3M 5P 9m', '', '(b9)', 'majaddb9 majb9 addb9 Maddb9', ''],
  ['1P 3M 5d', '', '(b5)', 'Mb5', ''],
  ['1P 3M 5d 6M 7m 9M', '', '', '13b5', ''],
  ['1P 3M 5d 7M', '', 'maj7b5', 'M7b5', ''],
  ['1P 3M 5d 7M 9M', '', '', 'maj9b5 M9b5', ''],
  ['1P 3M 5d 7m', '', '7b5', '', ''],
  ['1P 3M 5d 7m 9M', '', '9b5', '', ''],
  ['1P 3M 7m', '', '', '7no5 7omit5', ''],
  ['1P 3M 7m 13m', '', '7b13', '', ''],
  ['1P 3M 7m 9M', '', '', '9no5 9omit5', ''],
  ['1P 3M 7m 9M 13M', '', '', '13no5 13omit5', ''],  // 1 3 6 9 ?
  ['1P 3M 7m 9M 13m', '', '', '9b13', ''],
  ['1P 3m 4P 5P', '', 'madd4', '', ''],
  ['1P 3m 5A', '', '', 'm#5 m+ mb6', ''],
  ['1P 3m 5P 6M 9M', '', 'm6/9', 'm69 _69', ''],
  ['1P 3m 5P 6m 7M', '', '', 'mmaj7b6 mMaj7b6 mmaj7b13 mM7b6 mM7(b6) mmaj7-6', ''],
  ['1P 3m 5P 6m 7M 9M', '', '', 'mmaj9b6 mMaj9b6 mmaj9b13 mM9b6 mmaj9-6', ''],
  ['1P 3m 5P 7M 9M', '', 'mmaj9', 'mMaj9 -Maj9', ''],
  ['1P 3m 5P 7m 11P', '', 'm7add11 m7add4', '', ''],
  ['1P 3m 5P 9M', '', 'madd9', '', ''],
  ['1P 3m 5d 6M 7M', '', '', 'o7M7 dim7maj7 dim7+7', ''],
  ['1P 3m 5d 7M', '', '', 'oM7 dimmaj7 dim+7', ''],
  ['1P 3m 5d 7m', '', 'm7b5', 'h7 _7b5', 'half-diminished'],
  ['1P 3m 6m 7M', '', '', 'mb6maj7 mb6M7 mmaj7#5', ''],
  ['1P 3m 6m 7m', '', 'm7#5', '', ''],
  ['1P 3m 6m 7m 9M', '', '', 'm9#5 m7maj9#5 maj9#5', ''],
  ['1P 3m 6m 7m 9M 11P', '', '', 'm11A +5m7maj11', ''],
  ['1P 3m 6m 9m', '', '', 'mb6b9 +5b9', ''],
  ['1P 3m 7m 12d 2M', '', '', 'm9b5 h9 -9b5', ''],
  ['1P 3m 7m 12d 2M 4P', '', '', 'm11b5 h11 _11b5', ''],
  ['1P 4P 5A 7M', '', '', 'maj7#5sus4 M7#5sus4', ''],
  ['1P 4P 5A 7M 9M', '', '', 'maj9#5sus4 M9#5sus4', ''],
  ['1P 4P 5A 7m', '', '', '7#5sus4', ''],
  ['1P 4P 5P 7M', '', 'maj7sus4', 'maj77sus4 M7sus4', ''], //?
  ['1P 4P 5P 7M 9M', '', 'maj9sus4', 'M9sus4', ''],
  ['1P 4P 5P 7m 9M', '', '9sus4 9sus', '', ''],
  ['1P 4P 5P 7m 9M 13M', '5P 7m 9M', '', '13sus4 13sus', ''],
  ['1P 4P 5P 7m 9m 13m', '', '', '7sus4b9b13 7b9b13sus4', ''],
  ['1P 4P 7m 10m', '', '', '4 quartal', 'quartal'],
  ['1P 5P 7m 9m 11P', '', '11b9', '', ''],
  ['1P 2M 5P 7M', '', 'maj7sus2', 'Δsus2 ma7sus2 M7sus2 Maj7sus2', 'major seventh'],
  ['1P 3M 4P 5P', '', 'add4 add11', '', ''],
];

module.exports = {
  CHORD_DATA: parseData(CHORD_DATA),
};
