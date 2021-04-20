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
