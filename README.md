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
