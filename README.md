<p align="center">
  An <a href="https://www.github.com/gcanti/fp-ts">fp-ts</a> style ADT to capture the concept of an Option in progress.
</p>

<p align="center">
  <a href="https://travis-ci.org/nullpub/datum">
    <img src="https://img.shields.io/travis/nullpub/datum/master.svg?style=flat-square" alt="build status" height="20">
  </a>
  <a href='https://coveralls.io/github/nullpub/datum?branch=master'><img src='https://coveralls.io/repos/github/nullpub/datum/badge.svg?branch=master' alt='Coverage Status' height="20"/></a>
  <a href="https://david-dm.org/nullpub/datum">
    <img src="https://img.shields.io/david/nullpub/datum.svg?style=flat-square" alt="dependency status" height="20">
  </a>
  <a href="https://www.npmjs.com/package/@nll/datum">
    <img src="https://img.shields.io/npm/dm/@nll/datum.svg" alt="npm downloads" height="20">
  </a>
</p>

# @nll/datum

ADT for asynchronous data updated to work with [fp-ts@2+](https://github.com/gcanti/fp-ts).

## Usage

[Full Documentation](https://nullpub.github.io/datum/)

```bash
npm i @nll/datum fp-ts
```

```typescript
import { datumEither, map } from '@nll/datum/lib/DatumEither';

import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/pipeable';

const myData = datumEither.of(1);
const myOtherData = datumEither.of(2);

const dataSequence = sequenceT(datumEither)(myData, myOtherData);

const result = pipe(
  dataSequence,
  map(([a, b]) => a + b)
);

// result.value.right === 3;
```
