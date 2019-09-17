import * as assert from 'assert';
import * as DE from '../src/DatumEither';
import { refresh, replete } from '../src/Datum';
import { some, none } from 'fp-ts/lib/Option';
import { left, right } from 'fp-ts/lib/Either';

describe('Datum', () => {
  it('URI', () => {
    assert.strictEqual(DE.URI, '@nll/datum/datum-either');
  });

  it('isInitial', () => {
    assert.deepStrictEqual(DE.isInitial(DE.initial), true);
    assert.deepStrictEqual(DE.isInitial(DE.pending), false);
    assert.deepStrictEqual(DE.isInitial(DE.failure(1)), false);
    assert.deepStrictEqual(DE.isInitial(DE.toRefresh(DE.failure(1))), false);
    assert.deepStrictEqual(DE.isInitial(DE.success(1)), false);
    assert.deepStrictEqual(DE.isInitial(DE.toRefresh(DE.success(1))), false);
  });

  it('isPending', () => {
    assert.deepStrictEqual(DE.isPending(DE.initial), false);
    assert.deepStrictEqual(DE.isPending(DE.pending), true);
    assert.deepStrictEqual(DE.isPending(DE.failure(1)), false);
    assert.deepStrictEqual(DE.isPending(DE.toRefresh(DE.failure(1))), false);
    assert.deepStrictEqual(DE.isPending(DE.success(1)), false);
    assert.deepStrictEqual(DE.isPending(DE.toRefresh(DE.success(1))), false);
  });

  it('isRefresh', () => {
    assert.deepStrictEqual(DE.isRefresh(DE.initial), false);
    assert.deepStrictEqual(DE.isRefresh(DE.pending), false);
    assert.deepStrictEqual(DE.isRefresh(DE.failure(1)), false);
    assert.deepStrictEqual(DE.isRefresh(DE.toRefresh(DE.failure(1))), true);
    assert.deepStrictEqual(DE.isRefresh(DE.success(1)), false);
    assert.deepStrictEqual(DE.isRefresh(DE.toRefresh(DE.success(1))), true);
  });

  it('isReplete', () => {
    assert.deepStrictEqual(DE.isReplete(DE.initial), false);
    assert.deepStrictEqual(DE.isReplete(DE.pending), false);
    assert.deepStrictEqual(DE.isReplete(DE.failure(1)), true);
    assert.deepStrictEqual(DE.isReplete(DE.toRefresh(DE.failure(1))), false);
    assert.deepStrictEqual(DE.isReplete(DE.success(1)), true);
    assert.deepStrictEqual(DE.isReplete(DE.toRefresh(DE.success(1))), false);
  });

  it('isValued', () => {
    assert.deepStrictEqual(DE.isValued(DE.initial), false);
    assert.deepStrictEqual(DE.isValued(DE.pending), false);
    assert.deepStrictEqual(DE.isValued(DE.failure(1)), true);
    assert.deepStrictEqual(DE.isValued(DE.toRefresh(DE.failure(1))), true);
    assert.deepStrictEqual(DE.isValued(DE.success(1)), true);
    assert.deepStrictEqual(DE.isValued(DE.toRefresh(DE.success(1))), true);
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

  it('isRefreshLeft', () => {
    assert.deepStrictEqual(DE.isRefreshLeft(DE.initial), false);
    assert.deepStrictEqual(DE.isRefreshLeft(DE.pending), false);
    assert.deepStrictEqual(DE.isRefreshLeft(refresh(left(1))), true);
    assert.deepStrictEqual(DE.isRefreshLeft(refresh(right(1))), false);
    assert.deepStrictEqual(DE.isRefreshLeft(replete(left(1))), false);
    assert.deepStrictEqual(DE.isRefreshLeft(replete(right(1))), false);
  });

  it('isRefreshRight', () => {
    assert.deepStrictEqual(DE.isRefreshRight(DE.initial), false);
    assert.deepStrictEqual(DE.isRefreshRight(DE.pending), false);
    assert.deepStrictEqual(DE.isRefreshRight(refresh(left(1))), false);
    assert.deepStrictEqual(DE.isRefreshRight(refresh(right(1))), true);
    assert.deepStrictEqual(DE.isRefreshRight(replete(left(1))), false);
    assert.deepStrictEqual(DE.isRefreshRight(replete(right(1))), false);
  });

  it('isRepleteLeft', () => {
    assert.deepStrictEqual(DE.isRepleteLeft(DE.initial), false);
    assert.deepStrictEqual(DE.isRepleteLeft(DE.pending), false);
    assert.deepStrictEqual(DE.isRepleteLeft(refresh(left(1))), false);
    assert.deepStrictEqual(DE.isRepleteLeft(refresh(right(1))), false);
    assert.deepStrictEqual(DE.isRepleteLeft(replete(left(1))), true);
    assert.deepStrictEqual(DE.isRepleteLeft(replete(right(1))), false);
  });

  it('isRepleteRight', () => {
    assert.deepStrictEqual(DE.isRepleteRight(DE.initial), false);
    assert.deepStrictEqual(DE.isRepleteRight(DE.pending), false);
    assert.deepStrictEqual(DE.isRepleteRight(refresh(left(1))), false);
    assert.deepStrictEqual(DE.isRepleteRight(refresh(right(1))), false);
    assert.deepStrictEqual(DE.isRepleteRight(replete(left(1))), false);
    assert.deepStrictEqual(DE.isRepleteRight(replete(right(1))), true);
  });

  it('toRefresh', () => {
    assert.deepStrictEqual(DE.toRefresh(DE.initial), DE.pending);
    assert.deepStrictEqual(DE.toRefresh(DE.pending), DE.pending);
    assert.deepStrictEqual(DE.toRefresh(refresh(left(1))), refresh(left(1)));
    assert.deepStrictEqual(DE.toRefresh(refresh(right(1))), refresh(right(1)));
    assert.deepStrictEqual(DE.toRefresh(replete(left(1))), refresh(left(1)));
    assert.deepStrictEqual(DE.toRefresh(replete(right(1))), refresh(right(1)));
  });

  it('toReplete', () => {
    assert.deepStrictEqual(DE.toReplete(DE.initial), DE.initial);
    assert.deepStrictEqual(DE.toReplete(DE.pending), DE.initial);
    assert.deepStrictEqual(DE.toReplete(refresh(left(1))), replete(left(1)));
    assert.deepStrictEqual(DE.toReplete(refresh(right(1))), replete(right(1)));
    assert.deepStrictEqual(DE.toReplete(replete(left(1))), replete(left(1)));
    assert.deepStrictEqual(DE.toReplete(replete(right(1))), replete(right(1)));
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

  it('fold', () => {
    const onInitial = () => 'initial';
    const onPending = () => `pending`;
    const onRefreshLeft = (s: string) => `refreshLeft${s.length}`;
    const onRefreshRight = (s: string) => `refreshRight${s.length}`;
    const onRepleteLeft = (s: string) => `repleteLeft${s.length}`;
    const onRepleteRight = (s: string) => `repleteRight${s.length}`;

    const fold = DE.fold(
      onInitial,
      onPending,
      onRefreshLeft,
      onRefreshRight,
      onRepleteLeft,
      onRepleteRight
    );

    assert.strictEqual(fold(DE.initial), 'initial');
    assert.strictEqual(fold(DE.pending), 'pending');
    assert.strictEqual(fold(DE.failure('abc')), 'repleteLeft3');
    assert.strictEqual(fold(DE.success('abc')), 'repleteRight3');
    assert.strictEqual(fold(DE.toRefresh(DE.failure('abc'))), 'refreshLeft3');
    assert.strictEqual(fold(DE.toRefresh(DE.success('abc'))), 'refreshRight3');
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
