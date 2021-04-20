<p align="center">
  An <a href="https://www.github.com/gcanti/fp-ts">fp-ts</a> style ADT to capture the concept of an Option in progress.
</p>

<p align="center">
  <a href="https://travis-ci.org/nullpub/datum">
    <img src="https://img.shields.io/travis/nullpub/datum/master.svg" alt="build status" height="20">
  </a>
  <a href='https://coveralls.io/github/nullpub/datum?branch=master'>
    <img src='https://coveralls.io/repos/github/nullpub/datum/badge.svg?branch=master' alt='Coverage Status' height="20"/>
  </a>
  <a href="https://www.npmjs.com/package/@nll/datum">
    <img src="https://img.shields.io/npm/dm/@nll/datum.svg" alt="npm downloads" height="20">
  </a>
</p>

<p align="center">
  <a href="https://david-dm.org/nullpub/datum">
    <img src="https://img.shields.io/david/nullpub/datum.svg" alt="dependency status" height="20">
  </a>
  <a href="https://david-dm.org/nullpub/datum?type=dev">
    <img src="https://img.shields.io/david/dev/nullpub/datum.svg" alt="dev dependency status" height="20">
  </a>
  <a href="https://david-dm.org/nullpub/datum?type=peer">
    <img src="https://img.shields.io/david/peer/nullpub/datum.svg" alt="peer dependency status" height="20">
  </a>
</p>

# @nll/datum

ADT for asynchronous data updated to work with [fp-ts@2+](https://github.com/gcanti/fp-ts).

**Version 3+ release only includes an es module build. It also references the fp-ts/es6 build.**

## Documentation

[Full Documentation](https://nullpub.github.io/datum/)

## Usage Example

```bash
npm i @nll/datum fp-ts
```

```typescript
import { sequenceT } from 'fp-ts/es6/Apply';
import { pipe } from 'fp-ts/es6/pipeable';

import {
  DatumEither,
  Apply,
  failure,
  initial,
  map,
  pending,
  success,
  toRefresh
} from '../src/DatumEither';

const sequence = sequenceT(Apply);

// Here are some DatumEithers
const someInitial: DatumEither<string, string> = initial; // Type: Initial
const somePending: DatumEither<string, string> = pending; // Type: Pending
const someSuccess: DatumEither<string, string> = success('DATA!'); // Type: Replete<Right<string>>
const someFailure: DatumEither<string, string> = failure('ERROR!'); // Type: Replete<Left<string>>

// Here are some Refreshing Datume
const someRefreshingSuccess = toRefresh(someSuccess); // Type: Refresh<Right<string>>
const someRefreshingFailure = toRefresh(someFailure); // Type: Refresh<Left<string>>

const result1 = pipe(
  sequence(someInitial, somePending, someSuccess),
  map(([a, b, c]) => a + b + c)
);
console.log(result1);
/**
 * The initial short circuits the sequence
 * result1 === initial
 */

const result2 = pipe(
  sequence(someRefreshingSuccess, someRefreshingFailure),
  map(([a, b]) => a + b)
);
console.log(result2);
/**
 * The failure shortcircuits the sequence.
 * result2 === refresh(left('ERROR!'))
 */

const result3 = pipe(
  sequence(someSuccess, someRefreshingSuccess),
  map(([a, b]) => a + b)
);
console.log(result3);
/**
 * All values are good, so map is called, since one of the DatumEithers is refreshing, the sequence is refreshing
 * result3 = refresh(right('DATA!DATA!'))
 */
```
