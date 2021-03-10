import * as assert from 'assert';
import { datum, datumEither, datumThese, oneShot } from '../src';
import * as Datum from '../src/Datum';
import * as DatumEither from '../src/DatumEither';
import * as DatumThese from '../src/DatumThese';
import * as OneShot from '../src/OneShot';

describe('Index', () => {
  it('Re-exports the Datum module', () => {
    assert.strictEqual(datum, Datum);
  });

  it('Re-exports the DatumEither module', () => {
    assert.strictEqual(datumEither, DatumEither);
  });

  it ('Re-exports the DatumThese module', () => {
    assert.strictEqual(datumThese, DatumThese)
  });

  it('Re-exports the OneShot module', () => {
    assert.strictEqual(oneShot, OneShot);
  });
});
