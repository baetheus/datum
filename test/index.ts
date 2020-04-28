import * as assert from 'assert';
import { datum, datumEither } from '../src';
import * as Datum from '../src/Datum';
import * as DatumEither from '../src/DatumEither';

describe('Index', () => {
  it('Re-exports the Datum module', () => {
    assert.strictEqual(datum, Datum);
  });

  it('Re-exports the DatumEither module', () => {
    assert.strictEqual(datumEither, DatumEither);
  });
});
