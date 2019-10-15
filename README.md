[![npm](https://img.shields.io/npm/v/chord-fingering)](https://www.npmjs.com/package/chord-fingering)

# <a id="chord-fingering"></a> chord-fingering

A CommonJS module for generating chord fingerings for any tuning. Chords can be found by their symbols in the Anglophone alphabetic musical notation.

The package has been developed for the [Chordline app](https://hyvyys.github.io/chordline/).
This project uses and is inspired by [tonaljs](https://github.com/tonaljs/tonal), a music theory library.
The data powering the project comprises 111 unique chord patterns.

## <a id="Installation"></a> Installation

```shell
npm i chord-fingering
```

## <a id="Usage"></a> Basic usage

```js
import { findGuitarChord } from 'chord-fingering';

let chord = findGuitarChord('C');
console.log(chord.fingerings[0].positionString); // => 'x32010'
```

For more in-depth examples see [API](#API).

<br />
<br />

>   ### Table of contents
>
>   **[chord-fingering](#chord-fingering)**  
        [Installation](#Installation)  
        [Usage](#Usage)  
    **[API](#API)**  
        [findGuitarChord](#findGuitarChord)  
        [findChord](#findGuitarChord)  
        [findFingerings](#findFingerings)  
        [parseTuning](#parseTuning)  
        [detectBarre](#detectBarre)  
        [findPositions](#findPositions)  
        [getNoteValue](#getNoteValue)  
        [getNoteAbove](#getNoteAbove)  
        [findFret](#findFret)  
    **[Development](#Development)**  
        [Data](#Data)

# <a id="API"></a> API

Typical usage will be limited to `findGuitarChord`, `findChord`, or `findFingerings` functions, but other exposed functions are listed below as well.

## <a id="findGuitarChord"></a> findGuitarChord(symbol, [tuning]) ⇒ <code>object</code>
Find intervals, corresponding notes, and possible fingerings for a given chord symbol and tuning.

**Returns**: <code>object</code> - Chord data in format `{ symbol, intervals, optionalIntervals, requiredIntervals, tonic, notes, optionalNotes, requiredNotes, bass, description, fullName, fingerings }`.
                  Fingerings are in format `{ positions: [ { stringIndex: Number, fret: Number, note: String } ] }`, with muted strings omitted.      

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | Chord symbol, e.g. `'C'`, `'Dm'`, `'Ebmaj7'`, `'C#11b13'`. |
| [tuning] | <code>string</code> \| <code>Array&lt;string&gt;</code> | Array or hyphen-delimited list of notes of the tuning from the lowest (thickest string).                                   Can include octave number after the note.                                   E.g. `'E2-A2-D3-G3-B3-E4'` or `['D','A','D','F#','A','D']`.                                   Without octaves, starts from octave `2`. |

Internally calls `findChord` and `findFingerings` to return a merged chord object with fingerings.

```js
// ESnext
import { findGuitarChord } from 'chord-fingering';
// CommonJS
const findGuitarChord = require('chord-fingering').findGuitarChord;

let chord = findGuitarChord('C');
```

<details>
 <summary>Result</summary>

```powershell
{
  input: "C",
  symbol: "C",
  symbols: [ "" ],
  altSymbols: [],
  intervals: [ "1P", "3M", "5P" ],
  optionalIntervals: [],
  requiredIntervals: [ "1P", "3M", "5P" ],
  tonic: "C",
  notes: [ "C", "E", "G" ],
  optionalNotes: [],
  requiredNotes: [ "C", "E", "G" ],
  bass: "C",
  description: "major",
  fingerings: [
    {
      positions: [
        { stringNote: "A2", stringIndex: 1, fret: 3, note: "C3" },
        { stringNote: "D3", stringIndex: 2, fret: 2, note: "E3" },
        { stringNote: "G3", stringIndex: 3, fret: 0, note: "G3" },
        { stringNote: "B3", stringIndex: 4, fret: 1, note: "C4" },
        { stringNote: "E4", stringIndex: 5, fret: 0, note: "E4" }
      ],
      barre: null,
      positionString: "x32010",
      difficulty: 4.55
    }, {
      positions: [
        { stringNote: "A2", stringIndex: 1, fret: 3, note: "C3" },
        { stringNote: "D3", stringIndex: 2, fret: 5, note: "G3" },
        { stringNote: "G3", stringIndex: 3, fret: 5, note: "C4" },
        { stringNote: "B3", stringIndex: 4, fret: 5, note: "E4" },
        { stringNote: "E4", stringIndex: 5, fret: 3, note: "G4" }
      ],
      barre: { fret: 3, stringIndices: [ 1, 5 ] },
      positionString: "x35553",
      difficulty: 12.13
    }, {
      positions: [
        { stringNote: "E2", stringIndex: 0, fret: 8, note: "C3" },
        { stringNote: "A2", stringIndex: 1, fret: 10, note: "G3" },
        { stringNote: "D3", stringIndex: 2, fret: 10, note: "C4" },
        { stringNote: "G3", stringIndex: 3, fret: 9, note: "E4" },
        { stringNote: "B3", stringIndex: 4, fret: 8, note: "G4" },
        { stringNote: "E4", stringIndex: 5, fret: 8, note: "C5" }
      ],
      barre: { fret: 8, stringIndices: [ 0, 4, 5 ] },
      positionString: "8-10-10-9-8-8",
      difficulty: 9.84
    },
    // ... 15 more
  ]
}
```
</details>

## <a id="findChord"></a> findChord(symbol) ⇒ <code>object</code>
Find intervals and corresponding notes for a given chord symbol.

**Returns**: <code>object</code> - Chord data in format `{ symbol, intervals, optionalIntervals, requiredIntervals, tonic,
                  notes, optionalNotes, requiredNotes, bass, description }`.

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | Chord symbol, e.g. `'C'`, `'Dm'`, `'Ebmaj7'`, `'C#11b13'`. |

```js
// ESnext
import { findChord } from 'chord-fingering';
// CommonJS
const findChord = require('chord-fingering').findChord;

let chord1 = findChord('C');
let chord2 = findChord('Amaj7');
let chord3 = findChord('D#sus4');
let chord4 = findChord('Fdim');
let chord5 = findChord('Gbadd11');
```

<details>
  <summary>

  `chord1:`
  </summary>

```shell
{
  input: "C",
  symbol: "C",
  symbols: [ "" ],
  altSymbols: [],
  intervals: [ "1P", "3M", "5P" ],
  optionalIntervals: [],
  requiredIntervals: [ "1P", "3M", "5P" ],
  tonic: "C",
  notes: [ "C", "E", "G" ],
  optionalNotes: [],
  requiredNotes: [ "C", "E", "G" ],
  bass: "C",
  description: "major"
}
```
</details>

<details>
  <summary>

  `chord5:`
  </summary>

```shell
{
  input: "Gbadd11",
  symbol: "Gbadd4",
  symbols: [ "add4", "add11" ],
  altSymbols: [],
  intervals: [ "1P", "3M", "4P", "5P" ],
  optionalIntervals: [],
  requiredIntervals: [ "1P", "3M", "4P", "5P" ],
  tonic: "Gb",
  notes: [ "Gb", "Bb", "Cb", "Db" ],
  optionalNotes: [],
  requiredNotes: [ "Gb", "Bb", "Cb", "Db" ],
  bass: "Gb",
  description: ""
}
```
</details>

## <a id="findFingerings"></a> findFingerings(notes, [optionalNotes], [bass], [tuning]) ⇒ <code>object</code>
Return all positions within the first octave on the fretboard where a set of notes can be played in a given tuning.

**Returns**: <code>object</code> - Fingerings in format `{ positions: [ { stringIndex: Number, fret: Number, note: String } ] }`.
Muted strings are omitted.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| notes | <code>Array&lt;string&gt;</code> |  | Notes to be played, e.g. `['E', 'G#', 'B', 'D#']`. |
| [optionalNotes] | <code>Array&lt;string&gt;</code> |  | Notes that can be omitted for ease of playing, typically the fifth in an extended chord. | 
| [bass] | <code>string</code> |  | The lowest note in the chord, if other than the first of `notes` (typically for chord inversions). |
| [tuning] | <code>string</code> \| <code>Array&lt;string&gt;</code> | <code>&quot;E-A-D-G-B-E&quot;</code> | Array or hyphen-delimited list of notes of the tuning from the lowest (thickest string). Can include octave number after the note. E.g. `'E2-A2-D3-G3-B3-E4'` or `['D','A','D','F#','A','D']`. Without octaves, starts from octave `2`. |

```js
// ESnext
import { findFingerings } from 'chord-fingering';
// CommonJS
const findFingerings = require('chord-fingering').findFingerings;

const notes = ['E', 'G#', 'B', 'F'], optionalNotes = [];
const fingerings = findFingerings(notes, optionalNotes);
```

<details>
  <summary>

  `fingerings:`
  </summary>

```shell
[
  { positions: [ { stringNote: "E2", stringIndex: 0, fret: 0, note: "E2" },
      { stringNote: "A2", stringIndex: 1, fret: 2, note: "B2" },
      { stringNote: "D3", stringIndex: 2, fret: 2, note: "E3" },
      { stringNote: "G3", stringIndex: 3, fret: 1, note: "G#3" },
      { stringNote: "B3", stringIndex: 4, fret: 0, note: "B3" },
      { stringNote: "E4", stringIndex: 5, fret: 1, note: "F4" }
    ],
    barre: null,
    positionString: "022101",
    difficulty: 3.9
  }, { positions: [ { stringNote: "E2", stringIndex: 0, fret: 0, note: "E2" },
      { stringNote: "A2", stringIndex: 1, fret: 2, note: "B2" },
      { stringNote: "D3", stringIndex: 2, fret: 3, note: "F3" },
      { stringNote: "G3", stringIndex: 3, fret: 1, note: "G#3" },
      { stringNote: "B3", stringIndex: 4, fret: 0, note: "B3" },
      { stringNote: "E4", stringIndex: 5, fret: 0, note: "E4" }
    ],
    barre: null,
    positionString: "023100",
    difficulty: 8.75
  }, { positions: [ { stringNote: "E2", stringIndex: 0, fret: 0, note: "E2" },
      { stringNote: "A2", stringIndex: 1, fret: 2, note: "B2" },
      { stringNote: "D3", stringIndex: 2, fret: 3, note: "F3" },
      { stringNote: "G3", stringIndex: 3, fret: 1, note: "G#3" },
      { stringNote: "B3", stringIndex: 4, fret: 0, note: "B3" },
      { stringNote: "E4", stringIndex: 5, fret: 1, note: "F4" }
    ],
    barre: null,
    positionString: "023101",
    difficulty: 11.75
  }, { positions: [ { stringNote: "E2", stringIndex: 0, fret: 0, note: "E2" },
      { stringNote: "A2", stringIndex: 1, fret: 8, note: "F3" },
      { stringNote: "D3", stringIndex: 2, fret: 9, note: "B3" },
      { stringNote: "G3", stringIndex: 3, fret: 10, note: "F4" },
      { stringNote: "B3", stringIndex: 4, fret: 9, note: "G#4" },
      { stringNote: "E4", stringIndex: 5, fret: 0, note: "E4" }
    ],
    barre: null,
    positionString: "0-8-9-10-9-0",
    difficulty: 7.19
  }, { positions: [ { stringNote: "E2", stringIndex: 0, fret: 0, note: "E2" },
      { stringNote: "A2", stringIndex: 1, fret: 7, note: "E3" },
      { stringNote: "D3", stringIndex: 2, fret: 9, note: "B3" },
      { stringNote: "G3", stringIndex: 3, fret: 10, note: "F4" },
      { stringNote: "B3", stringIndex: 4, fret: 9, note: "G#4" },
      { stringNote: "E4", stringIndex: 5, fret: 0, note: "E4" }
    ],
    barre: null,
    positionString: "0-7-9-10-9-0",
    difficulty: 10.22
  }, { positions: [ { stringNote: "E2", stringIndex: 0, fret: 0, note: "E2" },
      { stringNote: "A2", stringIndex: 1, fret: 11, note: "G#3" },
      { stringNote: "D3", stringIndex: 2, fret: 9, note: "B3" },
      { stringNote: "G3", stringIndex: 3, fret: 10, note: "F4" },
      { stringNote: "B3", stringIndex: 4, fret: 9, note: "G#4" },
      { stringNote: "E4", stringIndex: 5, fret: 0, note: "E4" }
    ],
    barre: null,
    positionString: "0-11-9-10-9-0",
    difficulty: 9.56
  }, { positions: [ { stringNote: "D3", stringIndex: 2, fret: 2, note: "E3" },
      { stringNote: "G3", stringIndex: 3, fret: 1, note: "G#3" },
      { stringNote: "B3", stringIndex: 4, fret: 0, note: "B3" },
      { stringNote: "E4", stringIndex: 5, fret: 1, note: "F4" }
    ],
    barre: null,
    positionString: "xx2101",
    difficulty: 0.9
  }, { positions: [ { stringNote: "A2", stringIndex: 1, fret: 7, note: "E3" },
      { stringNote: "D3", stringIndex: 2, fret: 9, note: "B3" },
      { stringNote: "G3", stringIndex: 3, fret: 10, note: "F4" },
      { stringNote: "B3", stringIndex: 4, fret: 9, note: "G#4" },
      { stringNote: "E4", stringIndex: 5, fret: 0, note: "E4" }
    ],
    barre: null,
    positionString: "x-7-9-10-9-0",
    difficulty: 10.22
  },
  // ...15 more
]
```
</details>

## <a id="parseTuning"></a> parseTuning(arg) ⇒ <code>Array&lt;string&gt;</code>
Deduces tuning from a string.

**Returns**: <code>Array&lt;string&gt;</code> - Array of note pitches (with octave numbers) comprising the tuning, e.g. `['D2','A2','D3','F#3','A3','D4']`.

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>string</code> \| <code>Array&lt;string&gt;</code> | Array or hyphen-delimited list of notes of the tuning from the lowest (thickest string). Can include octave number after the note.  E.g. `'E-A-D-G-B-e'`, `'E2-A2-D3-G3-B3-E4'` or `['D','A','D','F#','A','D']`. By default, starts from octave `2`. |

## <a id="detectBarre"></a> detectBarre(positions, [stringCount]) ⇒ <code>object</code>
Detect barre in a fingering.

**Returns**: <code>object</code> - Barre in format `{ stringIndices: Number[], fret: Number } ] }` or `null`.

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>Array&lt;object&gt;</code> | Fingering in format `[ { stringIndex: Number, fret: Number } ]`. |
| positions[].stringIndex | <code>number</code> | Zero-based index of the guitar string, starting from lowest (thickest). |
| positions[].fret | <code>number</code> | Zero-based index of the guitar fret. |
| [stringCount] | <code>number</code> | Number of the instrument's strings, defaults to `6`. |

## <a id="findPositions"></a> findPositions(notes, [tuning]) ⇒ <code>Array&lt;Object&gt;</code>
Return all positions within the first octave on the fretboard where a set of notes can be played in a given tuning.

**Returns**: <code>Array&lt;Object&gt;</code> - Positions in format `{ stringIndex: Number, fret: Number, note: String }`.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| notes | <code>Array&lt;String&gt;</code> |  | Notes to be played, e.g. `['E', 'G#', 'B', 'D#']`. |
| [tuning] | <code>string</code> \| <code>Array&lt;string&gt;</code> | <code>&quot;E-A-D-G-B-E&quot;</code> | Array or hyphen-delimited list of notes of the tuning from the lowest (thickest string). Can include octave number after the note. E.g. `'E2-A2-D3-G3-B3-E4'` or `['D','A','D','F#','A','D']`. Without octaves, starts from octave `2`. |

## <a id="getNoteValue"></a> getNoteValue(note)
Return note stripped of octave number, e.g. `'C'`.

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | Note with optional octave number, e.g. `'C5'`. |

## <a id="getNoteAbove"></a> getNoteAbove(note, baseNote) ⇒
Given two notes, returns the first note with octave number such that it is the lowest note higher or equal than the second.

**Returns**: First note with octave number, e.g. `('D', 'G3') => 'D4'`

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | Note, with or without octave number, e.g. `'D'` |
| baseNote | <code>string</code> | Base note with octave, e.g. `'G3'` |

## <a id="findFret"></a> findFret(note, stringNote) ⇒ <code>Number</code>
Find the fret number within the first octave on the fretboard where a note can be played on a given string.

**Returns**: <code>Number</code> - Number of semitones (fret number), e.g. `4`.

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | Higher note (note to be played), e.g. `'G#'`. |
| stringNote | <code>String</code> | Lower note (note of the string), e.g. `'E'`. |


# <a id="Development"></a> Development

Currently there is no build process. The project is structured as a CommonJS module, so it can be used in Node as well as with Webpack.

Testing:

```shell
npm run test
```

## <a id="Data"></a> Data

Each of the 111 chord types is defined by its intervals, some of which may be considered optional for the purpose of deriving a guitar fingering of the chord. The chord type can have one or more symbol aliases.

Each entry is an array of five strings (for convenience and avoiding redundance), but this representation is normalized upon export into an object of the following properties:

```js
{
  intervals: [ "1P", "3M", "5P", "6M" ],  // all intervals comprising the chord (tonic, major third, perfect fifth, major sixth)
  optionalIntervals: [ "5P" ],            // intervals that can be arbitrarily omitted for ease of playing
  symbols: [ "6", "add6", "add13" ],      // aliases parsed by UltimateGuitar.com
  altSymbols: [ "M6" ],                   // other aliases
  description: "sixth"                    // verbal description of the chord type
}
```

Some of the entries contained in the dataset have no known symbols honored by UltimateGuitar.com, but such symbols might exist.
