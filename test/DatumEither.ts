import * as assert from 'assert';
import * as DE from '../src/DatumEither';
import { refresh, replete } from '../src/Datum';
import { some, none } from 'fp-ts/lib/Option';
import { left, right } from 'fp-ts/lib/Either';

describe('Datum', () => {
  it('URI', () => {
    assert.strictEqual(DE.URI, '@nll/datum/datum-either');
  });

  it('isSuccess', () => {
    assert.deepStrictEqual(DE.isSuccess(DE.initial), false);
    assert.deepStrictEqual(DE.isSuccess(DE.pending), false);
    assert.deepStrictEqual(DE.isSuccess(refresh(left(1))), false);
    assert.deepStrictEqual(DE.isSuccess(refresh(right(1))), true);
    assert.deepStrictEqual(DE.isSuccess(replete(left(1))), false);
    assert.deepStrictEqual(DE.isSuccess(replete(right(1))), true);
  });

  it('isFailure', () => {
    assert.deepStrictEqual(DE.isFailure(DE.initial), false);
    assert.deepStrictEqual(DE.isFailure(DE.pending), false);
    assert.deepStrictEqual(DE.isFailure(refresh(left(1))), true);
    assert.deepStrictEqual(DE.isFailure(refresh(right(1))), false);
    assert.deepStrictEqual(DE.isFailure(replete(left(1))), true);
    assert.deepStrictEqual(DE.isFailure(replete(right(1))), false);
  });

  it('toRefresh', () => {
    assert.deepStrictEqual(DE.toRefresh(DE.initial), DE.pending);
    assert.deepStrictEqual(DE.toRefresh(DE.pending), DE.pending);
    assert.deepStrictEqual(DE.toRefresh(refresh(left(1))), refresh(left(1)));
    assert.deepStrictEqual(DE.toRefresh(refresh(right(1))), refresh(right(1)));
    assert.deepStrictEqual(DE.toRefresh(replete(left(1))), refresh(left(1)));
    assert.deepStrictEqual(DE.toRefresh(replete(right(1))), refresh(right(1)));
  });

  it('fromEither', () => {
    assert.deepStrictEqual(DE.fromEither(() => left(1)), DE.failure(1));
    assert.deepStrictEqual(DE.fromEither(() => right(1)), DE.success(1));
  });

  it('fromOption', () => {
    assert.deepStrictEqual(DE.fromOption(() => 1)(some(0)), DE.success(0));
    assert.deepStrictEqual(DE.fromOption(() => 1)(none), DE.failure(1));
  });

  it('fromNullable', () => {
    assert.deepStrictEqual(DE.fromNullable(2), DE.success(2));
    assert.deepStrictEqual(DE.fromNullable(null), DE.initial);
    assert.deepStrictEqual(DE.fromNullable(undefined), DE.initial);
  });

  it('refreshFold', () => {
    const onInitial = () => `initial`;
    const onPending = () => `pending`;
    const onFailure = (s: string, r?: boolean) => `failure${s.length}${r}`;
    const onSuccess = (s: string, r?: boolean) => `success${s.length}${r}`;

    const refreshFold = DE.refreshFold(
      onInitial,
      onPending,
      onFailure,
      onSuccess
    );

    assert.strictEqual(refreshFold(DE.initial), 'initial');
    assert.strictEqual(refreshFold(DE.pending), 'pending');
    assert.strictEqual(
      refreshFold(DE.toRefresh(DE.failure('abc'))),
      'failure3true'
    );
    assert.strictEqual(
      refreshFold(DE.toRefresh(DE.success('abc'))),
      'success3true'
    );
    assert.strictEqual(refreshFold(DE.failure('abc')), 'failure3false');
    assert.strictEqual(refreshFold(DE.success('abc')), 'success3false');
  });

  it('squash', () => {
    const onNone = (r?: boolean) => `none${r}`;
    const onFailure = (s: string, r?: boolean) => `failure${s.length}${r}`;
    const onSuccess = (s: string, r?: boolean) => `success${s.length}${r}`;

    const squash = DE.squash(onNone, onFailure, onSuccess);

    assert.strictEqual(squash(DE.initial), 'nonefalse');
    assert.strictEqual(squash(DE.pending), 'nonetrue');
    assert.strictEqual(squash(DE.toRefresh(DE.failure('abc'))), 'failure3true');
    assert.strictEqual(squash(DE.toRefresh(DE.success('abc'))), 'success3true');
    assert.strictEqual(squash(DE.failure('abc')), 'failure3false');
    assert.strictEqual(squash(DE.success('abc')), 'success3false');
  });
});
