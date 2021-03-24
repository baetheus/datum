import * as assert from 'assert';
import * as DT from '../src/DatumThese';
import { refresh, replete } from '../src/Datum';
import { some, none, option } from 'fp-ts/es6/Option';
import { left, right, both, getSemigroup as theseGetSemigroup } from 'fp-ts/es6/These'
import { monoidSum } from 'fp-ts/es6/Monoid';
import { showNumber, showString } from 'fp-ts/es6/Show';
import { eqNumber, eqString } from 'fp-ts/es6/Eq';
import { semigroupString, semigroupSum } from 'fp-ts/es6/Semigroup';
import { identity } from 'fp-ts/es6/function';
import { DatumThese } from '../src/DatumThese';
import { Apply2C } from 'fp-ts/es6/Apply';
import { Applicative2C } from 'fp-ts/es6/Applicative';
import { Chain2C } from 'fp-ts/es6/Chain';

describe('DatumThese', () => {
    it('URI', () => {
        assert.strictEqual(DT.URI, '@nll/datum/DatumThese')
    })

    it('successR', () => {
        assert.deepStrictEqual(DT.successR(1), DT.toRefresh(DT.success(1)));
    });

    it('failureR', () => {
        assert.deepStrictEqual(DT.failureR(1), DT.toRefresh(DT.failure(1)));
    });

    it ('partialSuccessR', () => {
        assert.deepStrictEqual(DT.partialSuccessR(1, 1), DT.toRefresh(DT.partialSuccess(1, 1)))
    })

    it('isInitial', () => {
        assert.deepStrictEqual(DT.isInitial(DT.initial), true);
        assert.deepStrictEqual(DT.isInitial(DT.pending), false);
        assert.deepStrictEqual(DT.isInitial(DT.failure(1)), false);
        assert.deepStrictEqual(DT.isInitial(DT.toRefresh(DT.failure(1))), false);
        assert.deepStrictEqual(DT.isInitial(DT.success(1)), false);
        assert.deepStrictEqual(DT.isInitial(DT.toRefresh(DT.success(1))), false);
        assert.deepStrictEqual(DT.isInitial(DT.partialSuccess(1, 1)), false);
        assert.deepStrictEqual(DT.isInitial(DT.toRefresh(DT.partialSuccess(1, 1))), false);
    });

    it('isPending', () => {
        assert.deepStrictEqual(DT.isPending(DT.initial), false);
        assert.deepStrictEqual(DT.isPending(DT.pending), true);
        assert.deepStrictEqual(DT.isPending(DT.failure(1)), false);
        assert.deepStrictEqual(DT.isPending(DT.toRefresh(DT.failure(1))), false);
        assert.deepStrictEqual(DT.isPending(DT.success(1)), false);
        assert.deepStrictEqual(DT.isPending(DT.toRefresh(DT.success(1))), false);
        assert.deepStrictEqual(DT.isPending(DT.partialSuccess(1, 1)), false);
        assert.deepStrictEqual(DT.isPending(DT.toRefresh(DT.partialSuccess(1, 1))), false);
    });

    it('isRefresh', () => {
        assert.deepStrictEqual(DT.isRefresh(DT.initial), false);
        assert.deepStrictEqual(DT.isRefresh(DT.pending), false);
        assert.deepStrictEqual(DT.isRefresh(DT.failure(1)), false);
        assert.deepStrictEqual(DT.isRefresh(DT.toRefresh(DT.failure(1))), true);
        assert.deepStrictEqual(DT.isRefresh(DT.success(1)), false);
        assert.deepStrictEqual(DT.isRefresh(DT.toRefresh(DT.success(1))), true);
        assert.deepStrictEqual(DT.isRefresh(DT.partialSuccess(1, 1)), false);
        assert.deepStrictEqual(DT.isRefresh(DT.toRefresh(DT.partialSuccess(1, 1))), true);
    });

    it('isReplete', () => {
        assert.deepStrictEqual(DT.isReplete(DT.initial), false);
        assert.deepStrictEqual(DT.isReplete(DT.pending), false);
        assert.deepStrictEqual(DT.isReplete(DT.failure(1)), true);
        assert.deepStrictEqual(DT.isReplete(DT.toRefresh(DT.failure(1))), false);
        assert.deepStrictEqual(DT.isReplete(DT.success(1)), true);
        assert.deepStrictEqual(DT.isReplete(DT.toRefresh(DT.success(1))), false);
        assert.deepStrictEqual(DT.isReplete(DT.partialSuccess(1, 1)), true);
        assert.deepStrictEqual(DT.isReplete(DT.toRefresh(DT.partialSuccess(1, 1))), false);
    });

    it('isValued', () => {
        assert.deepStrictEqual(DT.isValued(DT.initial), false);
        assert.deepStrictEqual(DT.isValued(DT.pending), false);
        assert.deepStrictEqual(DT.isValued(DT.failure(1)), true);
        assert.deepStrictEqual(DT.isValued(DT.toRefresh(DT.failure(1))), true);
        assert.deepStrictEqual(DT.isValued(DT.success(1)), true);
        assert.deepStrictEqual(DT.isValued(DT.toRefresh(DT.success(1))), true);
        assert.deepStrictEqual(DT.isValued(DT.partialSuccess(1, 1)), true);
        assert.deepStrictEqual(DT.isValued(DT.toRefresh(DT.partialSuccess(1, 1))), true);
    });

    it('isSuccess', () => {
        assert.deepStrictEqual(DT.isSuccess(DT.initial), false);
        assert.deepStrictEqual(DT.isSuccess(DT.pending), false);
        assert.deepStrictEqual(DT.isSuccess(refresh(left(1))), false);
        assert.deepStrictEqual(DT.isSuccess(refresh(right(1))), true);
        assert.deepStrictEqual(DT.isSuccess(refresh(both(1, 1))), false);
        assert.deepStrictEqual(DT.isSuccess(replete(left(1))), false);
        assert.deepStrictEqual(DT.isSuccess(replete(right(1))), true);
        assert.deepStrictEqual(DT.isSuccess(replete(both(1, 1))), false)
      });
    
    it('isFailure', () => {
        assert.deepStrictEqual(DT.isFailure(DT.initial), false);
        assert.deepStrictEqual(DT.isFailure(DT.pending), false);
        assert.deepStrictEqual(DT.isFailure(refresh(left(1))), true);
        assert.deepStrictEqual(DT.isFailure(refresh(right(1))), false);
        assert.deepStrictEqual(DT.isFailure(refresh(both(1, 1))), false);
        assert.deepStrictEqual(DT.isFailure(replete(left(1))), true);
        assert.deepStrictEqual(DT.isFailure(replete(right(1))), false);
        assert.deepStrictEqual(DT.isFailure(replete(both(1, 1))), false);
    });

    it('isPartialSuccess', () => {
        assert.deepStrictEqual(DT.isPartialSuccess(DT.initial), false);
        assert.deepStrictEqual(DT.isPartialSuccess(DT.pending), false);
        assert.deepStrictEqual(DT.isPartialSuccess(refresh(left(1))), false);
        assert.deepStrictEqual(DT.isPartialSuccess(refresh(right(1))), false);
        assert.deepStrictEqual(DT.isPartialSuccess(refresh(both(1, 1))), true);
        assert.deepStrictEqual(DT.isPartialSuccess(replete(left(1))), false);
        assert.deepStrictEqual(DT.isPartialSuccess(replete(right(1))), false);
        assert.deepStrictEqual(DT.isPartialSuccess(replete(both(1, 1))), true);
    });

    it('isRefreshLeft', () => {
        assert.deepStrictEqual(DT.isRefreshLeft(DT.initial), false);
        assert.deepStrictEqual(DT.isRefreshLeft(DT.pending), false);
        assert.deepStrictEqual(DT.isRefreshLeft(refresh(left(1))), true);
        assert.deepStrictEqual(DT.isRefreshLeft(refresh(right(1))), false);
        assert.deepStrictEqual(DT.isRefreshLeft(refresh(both(1, 1))), false);
        assert.deepStrictEqual(DT.isRefreshLeft(replete(left(1))), false);
        assert.deepStrictEqual(DT.isRefreshLeft(replete(right(1))), false);
        assert.deepStrictEqual(DT.isRefreshLeft(replete(both(1, 1))), false);
      });
    
    it('isRefreshRight', () => {
        assert.deepStrictEqual(DT.isRefreshRight(DT.initial), false);
        assert.deepStrictEqual(DT.isRefreshRight(DT.pending), false);
        assert.deepStrictEqual(DT.isRefreshRight(refresh(left(1))), false);
        assert.deepStrictEqual(DT.isRefreshRight(refresh(right(1))), true);
        assert.deepStrictEqual(DT.isRefreshRight(refresh(both(1, 1))), false);
        assert.deepStrictEqual(DT.isRefreshRight(replete(left(1))), false);
        assert.deepStrictEqual(DT.isRefreshRight(replete(right(1))), false);
        assert.deepStrictEqual(DT.isRefreshRight(replete(both(1, 1))), false);
    });

    it('isRefreshBoth', () => {
        assert.deepStrictEqual(DT.isRefreshBoth(DT.initial), false);
        assert.deepStrictEqual(DT.isRefreshBoth(DT.pending), false);
        assert.deepStrictEqual(DT.isRefreshBoth(refresh(left(1))), false);
        assert.deepStrictEqual(DT.isRefreshBoth(refresh(right(1))), false);
        assert.deepStrictEqual(DT.isRefreshBoth(refresh(both(1, 1))), true);
        assert.deepStrictEqual(DT.isRefreshBoth(replete(left(1))), false);
        assert.deepStrictEqual(DT.isRefreshBoth(replete(right(1))), false);
        assert.deepStrictEqual(DT.isRefreshBoth(replete(both(1, 1))), false);
    });
    
    it('isRepleteLeft', () => {
        assert.deepStrictEqual(DT.isRepleteLeft(DT.initial), false);
        assert.deepStrictEqual(DT.isRepleteLeft(DT.pending), false);
        assert.deepStrictEqual(DT.isRepleteLeft(refresh(left(1))), false);
        assert.deepStrictEqual(DT.isRepleteLeft(refresh(right(1))), false);
        assert.deepStrictEqual(DT.isRepleteLeft(refresh(both(1, 1))), false);
        assert.deepStrictEqual(DT.isRepleteLeft(replete(left(1))), true);
        assert.deepStrictEqual(DT.isRepleteLeft(replete(right(1))), false);
        assert.deepStrictEqual(DT.isRepleteLeft(replete(both(1, 1))), false);
    });
    
    it('isRepleteRight', () => {
        assert.deepStrictEqual(DT.isRepleteRight(DT.initial), false);
        assert.deepStrictEqual(DT.isRepleteRight(DT.pending), false);
        assert.deepStrictEqual(DT.isRepleteRight(refresh(left(1))), false);
        assert.deepStrictEqual(DT.isRepleteRight(refresh(right(1))), false);
        assert.deepStrictEqual(DT.isRepleteRight(refresh(both(1, 1))), false);
        assert.deepStrictEqual(DT.isRepleteRight(replete(left(1))), false);
        assert.deepStrictEqual(DT.isRepleteRight(replete(right(1))), true);
        assert.deepStrictEqual(DT.isRepleteRight(replete(both(1, 1))), false);
    });

    it('isRepleteBoth', () => {
        assert.deepStrictEqual(DT.isRepleteBoth(DT.initial), false);
        assert.deepStrictEqual(DT.isRepleteBoth(DT.pending), false);
        assert.deepStrictEqual(DT.isRepleteBoth(refresh(left(1))), false);
        assert.deepStrictEqual(DT.isRepleteBoth(refresh(right(1))), false);
        assert.deepStrictEqual(DT.isRepleteBoth(refresh(both(1, 1))), false);
        assert.deepStrictEqual(DT.isRepleteBoth(replete(left(1))), false);
        assert.deepStrictEqual(DT.isRepleteBoth(replete(right(1))), false);
        assert.deepStrictEqual(DT.isRepleteBoth(replete(both(1, 1))), true);
    });

    it('toRefresh', () => {
        assert.deepStrictEqual(DT.toRefresh(DT.initial), DT.pending);
        assert.deepStrictEqual(DT.toRefresh(DT.pending), DT.pending);
        assert.deepStrictEqual(DT.toRefresh(refresh(left(1))), refresh(left(1)));
        assert.deepStrictEqual(DT.toRefresh(refresh(right(1))), refresh(right(1)));
        assert.deepStrictEqual(DT.toRefresh(refresh(both(1, 1))), refresh(both(1, 1)));
        assert.deepStrictEqual(DT.toRefresh(replete(left(1))), refresh(left(1)));
        assert.deepStrictEqual(DT.toRefresh(replete(right(1))), refresh(right(1)));
        assert.deepStrictEqual(DT.toRefresh(replete(both(1, 1))), refresh(both(1, 1)));
      });
    
    it('toReplete', () => {
        assert.deepStrictEqual(DT.toReplete(DT.initial), DT.initial);
        assert.deepStrictEqual(DT.toReplete(DT.pending), DT.initial);
        assert.deepStrictEqual(DT.toReplete(refresh(left(1))), replete(left(1)));
        assert.deepStrictEqual(DT.toReplete(refresh(right(1))), replete(right(1)));
        assert.deepStrictEqual(DT.toReplete(refresh(both(1, 1))), replete(both(1, 1)));
        assert.deepStrictEqual(DT.toReplete(replete(left(1))), replete(left(1)));
        assert.deepStrictEqual(DT.toReplete(replete(right(1))), replete(right(1)));
        assert.deepStrictEqual(DT.toReplete(replete(both(1, 1))), replete(both(1, 1)));
    });

    it('fromOption', () => {
        assert.deepStrictEqual(DT.fromOption(() => 1)(some(0)), DT.success(0));
        assert.deepStrictEqual(DT.fromOption(() => 1)(none), DT.failure(1));
    });

    it('fromNullable', () => {
        assert.deepStrictEqual(DT.fromNullable(2), DT.success(2));
        assert.deepStrictEqual(DT.fromNullable(null), DT.initial);
        assert.deepStrictEqual(DT.fromNullable(undefined), DT.initial);
    });

    it('fold', () => {
        const onInitial = () => 'initial';
        const onPending = () => `pending`;
        const onRefreshLeft = (s: string) => `refreshLeft${s.length}`;
        const onRefreshRight = (s: string) => `refreshRight${s.length}`;
        const onRefreshBoth = (e: string, a: string) => `refreshBoth${e.length}:${a.length}`;
        const onRepleteLeft = (s: string) => `repleteLeft${s.length}`;
        const onRepleteRight = (s: string) => `repleteRight${s.length}`;
        const onRepleteBoth = (e: string, a: string) => `repleteBoth${e.length}:${a.length}`;

    
        const fold = DT.fold(
          onInitial,
          onPending,
          onRefreshLeft,
          onRefreshRight,
          onRefreshBoth,
          onRepleteLeft,
          onRepleteRight,
          onRepleteBoth
        );
    
        assert.strictEqual(fold(DT.initial), 'initial');
        assert.strictEqual(fold(DT.pending), 'pending');
        assert.strictEqual(fold(DT.failure('abc')), 'repleteLeft3');
        assert.strictEqual(fold(DT.success('abc')), 'repleteRight3');
        assert.strictEqual(fold(DT.partialSuccess('ab', 'cdef')), 'repleteBoth2:4');
        assert.strictEqual(fold(DT.toRefresh(DT.failure('abc'))), 'refreshLeft3');
        assert.strictEqual(fold(DT.toRefresh(DT.success('abc'))), 'refreshRight3');
        assert.strictEqual(fold(DT.toRefresh(DT.partialSuccess('ab', 'cdef'))), 'refreshBoth2:4');
    });

    it('refreshFold', () => {
        const onInitial = () => `initial`;
        const onPending = () => `pending`;
        const onFailure = (s: string, r?: boolean) => `failure${s.length}${r}`;
        const onSuccess = (s: string, r?: boolean) => `success${s.length}${r}`;
        const onPartialSuccess = (e: string, a: string, r?: boolean) => `partialSuccess${e.length}:${a.length}${r}`;
    
        const refreshFold = DT.refreshFold(
          onInitial,
          onPending,
          onFailure,
          onSuccess,
          onPartialSuccess
        );
    
        assert.strictEqual(refreshFold(DT.initial), 'initial');
        assert.strictEqual(refreshFold(DT.pending), 'pending');
        assert.strictEqual(
          refreshFold(DT.toRefresh(DT.failure('abc'))),
          'failure3true'
        );
        assert.strictEqual(
          refreshFold(DT.toRefresh(DT.success('abc'))),
          'success3true'
        );
        assert.strictEqual(
            refreshFold(DT.toRefresh(DT.partialSuccessR('ab', 'cdef'))),
            'partialSuccess2:4true'
        );
        assert.strictEqual(refreshFold(DT.failure('abc')), 'failure3false');
        assert.strictEqual(refreshFold(DT.success('abc')), 'success3false');
        assert.strictEqual(refreshFold(DT.partialSuccess('ab', 'cdef')), 'partialSuccess2:4false');
    });

    it('squash', () => {
        const onNone = (r?: boolean) => `none${r}`;
        const onFailure = (s: string, r?: boolean) => `failure${s.length}${r}`;
        const onSuccess = (s: string, r?: boolean) => `success${s.length}${r}`;
        const onPartialSuccess = (e: string, a: string, r?: boolean) => `partialSuccess${e.length}:${a.length}${r}`;
    
        const squash = DT.squash(onNone, onFailure, onSuccess, onPartialSuccess);
    
        assert.strictEqual(squash(DT.initial), 'nonefalse');
        assert.strictEqual(squash(DT.pending), 'nonetrue');
        assert.strictEqual(squash(DT.toRefresh(DT.failure('abc'))), 'failure3true');
        assert.strictEqual(squash(DT.toRefresh(DT.success('abc'))), 'success3true');
        assert.strictEqual(squash(DT.toRefresh(DT.partialSuccess('ab', 'cdef'))), 'partialSuccess2:4true');
        assert.strictEqual(squash(DT.failure('abc')), 'failure3false');
        assert.strictEqual(squash(DT.success('abc')), 'success3false');
        assert.strictEqual(squash(DT.partialSuccess('ab', 'cdef')), 'partialSuccess2:4false');
    });

    it('traverse', () => {
        const traverse = DT.Traversable.traverse(option);
        const fab = (n: number) => (n < 0 ? none : some(n));
    
        assert.deepStrictEqual(traverse(DT.initial, fab), some(DT.initial));
        assert.deepStrictEqual(traverse(DT.pending, fab), some(DT.pending));
        assert.deepStrictEqual(
          traverse(DT.toRefresh(DT.success(0)), fab),
          some(DT.toRefresh(DT.success(0)))
        );
        assert.deepStrictEqual(
          traverse(DT.toRefresh(DT.failure(0)), fab),
          some(DT.toRefresh(DT.failure(0)))
        );
        assert.deepStrictEqual(
            traverse(DT.toRefresh(DT.partialSuccess(0, 0)), fab),
            some(DT.toRefresh(DT.partialSuccess(0, 0)))
        );
        assert.deepStrictEqual(traverse(DT.toRefresh(DT.success(-1)), fab), none);
        assert.deepStrictEqual(
          traverse(DT.toRefresh(DT.failure(-1)), fab),
          some(DT.toRefresh(DT.failure(-1)))
        );
        assert.deepStrictEqual(
            traverse(DT.toRefresh(DT.partialSuccess(-1, -1)), fab),
            none
        );
        assert.deepStrictEqual(traverse(DT.success(0), fab), some(DT.success(0)));
        assert.deepStrictEqual(traverse(DT.failure(0), fab), some(DT.failure(0)));
        assert.deepStrictEqual(traverse(DT.partialSuccess(0, 0), fab), some(DT.partialSuccess(0, 0)))
        assert.deepStrictEqual(traverse(DT.success(-1), fab), none);
        assert.deepStrictEqual(traverse(DT.failure(-1), fab), some(DT.failure(-1)));
        assert.deepStrictEqual(traverse(DT.partialSuccess(-1, -1), fab), none);
    });

    it('sequence', () => {
        const sequence = DT.Traversable.sequence(option);
    
        assert.deepStrictEqual(sequence(DT.initial), some(DT.initial));
        assert.deepStrictEqual(sequence(DT.pending), some(DT.pending));
        assert.deepStrictEqual(sequence(DT.failure(0)), some(DT.failure(0)));
        assert.deepStrictEqual(
          sequence(DT.toRefresh(DT.failure(0))),
          some(DT.toRefresh(DT.failure(0)))
        );
        assert.deepStrictEqual(sequence(DT.success(none)), none);
        assert.deepStrictEqual(sequence(DT.success(some(0))), some(DT.success(0)));
        assert.deepStrictEqual(sequence(DT.partialSuccess(0, none)), none);
        assert.deepStrictEqual(sequence(DT.partialSuccess(0, some(0))), some(DT.partialSuccess(0, 0)));

        assert.deepStrictEqual(sequence(DT.toRefresh(DT.success(none))), none);
        assert.deepStrictEqual(
          sequence(DT.toRefresh(DT.success(some(0)))),
          some(DT.toRefresh(DT.success(0)))
        );
        assert.deepStrictEqual(sequence(DT.toRefresh(DT.partialSuccess(0, none))), none);
        assert.deepStrictEqual(
            sequence(DT.toRefresh(DT.partialSuccess(0, some(0)))),
            some(DT.toRefresh(DT.partialSuccess(0, 0)))
        );
    });

    it('reduce', () => {
        const reduce = DT.Traversable.reduce;
        const add = (acc: number, cur: number): number => acc + cur;
    
        assert.deepStrictEqual(reduce(DT.initial, 0, add), 0);
        assert.deepStrictEqual(reduce(DT.pending, 0, add), 0);
        assert.deepStrictEqual(reduce(DT.success(1), 0, add), 1);
        assert.deepStrictEqual(reduce(DT.failure(1), 0, add), 0);
        assert.deepStrictEqual(reduce(DT.partialSuccess(0, 1), 0, add), 1);
        assert.deepStrictEqual(reduce(DT.toRefresh(DT.success(1)), 0, add), 1);
        assert.deepStrictEqual(reduce(DT.toRefresh(DT.failure(1)), 0, add), 0);
        assert.deepStrictEqual(reduce(DT.toRefresh(DT.partialSuccess(0, 1)), 0, add), 1);
    });

    it('foldMap', () => {
        const fab = (s: string): number => s.length;
        const foldMap = DT.foldMap(monoidSum)(fab);
    
        assert.deepStrictEqual(foldMap(DT.initial), monoidSum.empty);
        assert.deepStrictEqual(foldMap(DT.pending), monoidSum.empty);
        assert.deepStrictEqual(foldMap(DT.success('Hello')), 5);
        assert.deepStrictEqual(foldMap(DT.failure('Hello')), monoidSum.empty);
        assert.deepStrictEqual(foldMap(DT.partialSuccess('ab', 'cdef')), 4);
        assert.deepStrictEqual(foldMap(DT.toRefresh(DT.success('Hello'))), 5);
        assert.deepStrictEqual(
          foldMap(DT.toRefresh(DT.failure('Hello'))),
          monoidSum.empty
        );
        assert.deepStrictEqual(
            foldMap(DT.toRefresh(DT.partialSuccess('ab', 'cdef'))), 
            4
        );
    });

    it('reduceRight', () => {
        const reduce = DT.Traversable.reduceRight;
        const add = (acc: number, cur: number): number => acc + cur;
    
        assert.deepStrictEqual(reduce(DT.initial, 0, add), 0);
        assert.deepStrictEqual(reduce(DT.pending, 0, add), 0);
        assert.deepStrictEqual(reduce(DT.success(1), 0, add), 1);
        assert.deepStrictEqual(reduce(DT.failure(1), 0, add), 0);
        assert.deepStrictEqual(reduce(DT.partialSuccess(0, 1), 0, add), 1);
        assert.deepStrictEqual(reduce(DT.toRefresh(DT.success(1)), 0, add), 1);
        assert.deepStrictEqual(reduce(DT.toRefresh(DT.failure(1)), 0, add), 0);
        assert.deepStrictEqual(reduce(DT.toRefresh(DT.partialSuccess(0, 1)), 0, add), 1);
    });

    it('getShow', () => {
        const S = DT.getShow(showString, showNumber);
        assert.strictEqual(S.show(DT.initial), 'initial');
        assert.strictEqual(S.show(DT.pending), 'pending');
        assert.strictEqual(S.show(DT.success(1)), 'replete(right(1))');
        assert.strictEqual(S.show(DT.failure('a')), 'replete(left("a"))');
        assert.strictEqual(S.show(DT.partialSuccess('a', 1)), 'replete(both("a", 1))');
        assert.strictEqual(S.show(DT.successR(1)), 'refresh(right(1))');
        assert.strictEqual(S.show(DT.failureR('a')), 'refresh(left("a"))');
        assert.strictEqual(S.show(DT.partialSuccessR('a', 1)), 'refresh(both("a", 1))');
    });

    it('getEq', () => {
        const E = DT.getEq(eqString, eqNumber);

        // Sanity check reference equality not needed
        assert.strictEqual(E.equals(DT.success(1), DT.success(1)), true)

        const uniqueValues = [
            DT.initial,
            DT.pending,
            DT.success(1),
            DT.failure('a'),
            DT.partialSuccess('a', 1),
            DT.success(2),
            DT.failure('b'),
            DT.partialSuccess('b', 2),
            DT.successR(1),
            DT.failureR('a'),
            DT.partialSuccessR('a', 1),
            DT.successR(2),
            DT.failureR('b'),
            DT.partialSuccessR('b', 2),
        ];

        for (let i = 0; i < uniqueValues.length; i++) {
            for (let j = i; j < uniqueValues.length; j++) {
                assert.strictEqual(E.equals(uniqueValues[i], uniqueValues[j]), i === j)
            }
        }
    });

    it('getApplySemigroup', () => {

        const S = DT.getApplySemigroup(theseGetSemigroup(semigroupString, semigroupSum));

        const values = [
            DT.success(1),
            DT.failure('a'),
            DT.partialSuccess('a', 1),
            DT.successR(1),
            DT.failureR('a'),
            DT.partialSuccessR('a', 1),
        ];

        const noValues = [
            DT.initial, 
            DT.pending
        ];

        assert.deepStrictEqual(S.concat(DT.initial, DT.initial), DT.initial);
        assert.deepStrictEqual(S.concat(DT.initial, DT.pending), DT.initial);
        assert.deepStrictEqual(S.concat(DT.pending, DT.pending), DT.pending);
        assert.deepStrictEqual(S.concat(DT.pending, DT.initial), DT.pending);

        noValues.forEach(noValue => {
            values.forEach(value => {
                assert.deepStrictEqual(S.concat(noValue, value), noValue);
                assert.deepStrictEqual(S.concat(value, noValue), noValue);
            });
        });

        const modifiers = [
            identity,
            DT.toRefresh
        ];

        // Replete/Refresh of first valued datum does not matter
        modifiers.forEach(modifier => {
            assert.deepStrictEqual(S.concat(modifier(DT.success(1)), DT.success(1)), DT.success(2));
            assert.deepStrictEqual(S.concat(modifier(DT.success(1)), DT.failure('a')), DT.partialSuccess('a', 1));
            assert.deepStrictEqual(S.concat(modifier(DT.success(1)), DT.partialSuccess('a', 1)), DT.partialSuccess('a', 2));
            assert.deepStrictEqual(S.concat(modifier(DT.success(1)), DT.successR(1)), DT.successR(2));
            assert.deepStrictEqual(S.concat(modifier(DT.success(1)), DT.failureR('a')), DT.partialSuccessR('a', 1));
            assert.deepStrictEqual(S.concat(modifier(DT.success(1)), DT.partialSuccessR('a', 1)), DT.partialSuccessR('a', 2));
    
            assert.deepStrictEqual(S.concat(modifier(DT.failure('a')), DT.success(1)), DT.partialSuccess('a', 1));
            assert.deepStrictEqual(S.concat(modifier(DT.failure('a')), DT.failure('a')), DT.failure('aa'));
            assert.deepStrictEqual(S.concat(modifier(DT.failure('a')), DT.partialSuccess('a', 1)), DT.partialSuccess('aa', 1));
            assert.deepStrictEqual(S.concat(modifier(DT.failure('a')), DT.successR(1)), DT.partialSuccessR('a', 1));
            assert.deepStrictEqual(S.concat(modifier(DT.failure('a')), DT.failureR('a')), DT.failureR('aa'));
            assert.deepStrictEqual(S.concat(modifier(DT.failure('a')), DT.partialSuccessR('a', 1)), DT.partialSuccessR('aa', 1));
    
            assert.deepStrictEqual(S.concat(modifier(DT.partialSuccess('a', 1)), DT.success(1)), DT.partialSuccess('a', 2));
            assert.deepStrictEqual(S.concat(modifier(DT.partialSuccess('a', 1)), DT.failure('a')), DT.partialSuccess('aa', 1));
            assert.deepStrictEqual(S.concat(modifier(DT.partialSuccess('a', 1)), DT.partialSuccess('a', 1)), DT.partialSuccess('aa', 2));
            assert.deepStrictEqual(S.concat(modifier(DT.partialSuccess('a', 1)), DT.successR(1)), DT.partialSuccessR('a', 2));
            assert.deepStrictEqual(S.concat(modifier(DT.partialSuccess('a', 1)), DT.failureR('a')), DT.partialSuccessR('aa', 1));
            assert.deepStrictEqual(S.concat(modifier(DT.partialSuccess('a', 1)), DT.partialSuccessR('a', 1)), DT.partialSuccessR('aa', 2));
        });
    });

    function assertAp(A: Apply2C<DT.URI, string>) {
        const f = (n: number) => n * 2;

        const noValues = [
            DT.initial,
            DT.pending,
        ];

        const values = [
            DT.success(1),
            DT.failure('a'),
            DT.partialSuccess('a', 1),
            DT.successR(1),
            DT.failureR('a'),
            DT.partialSuccessR('a', 1)
        ];

        noValues.forEach(noValue1 => {
            noValues.forEach(noValue2 => {
                assert.deepStrictEqual(A.ap(noValue1, noValue2), noValue1)
            });
        });

        noValues.forEach(noValue => {
            values.forEach(value => {
                assert.deepStrictEqual(A.ap(noValue, value), noValue)
            });
        });

        noValues.forEach(noValue => {
            assert.deepStrictEqual(A.ap(DT.success(f), noValue), noValue)
            assert.deepStrictEqual(A.ap(DT.partialSuccess('a', f), noValue), noValue)
            assert.deepStrictEqual(A.ap(DT.successR(f), noValue), noValue)
            assert.deepStrictEqual(A.ap(DT.partialSuccessR('a', f), noValue), noValue)
        });

        values.concat(noValues).forEach(val => {
            const failFn: DatumThese<string, typeof f> = DT.failure('a')
            const failFnR: DatumThese<string, typeof f> = DT.failureR('a')
            assert.deepStrictEqual(A.ap(failFn, val), DT.failure('a'))
            assert.deepStrictEqual(A.ap(failFnR, val), DT.failure('a'))
        })

        assert.deepStrictEqual(A.ap(DT.success(f), DT.success(1)), DT.success(2));
        assert.deepStrictEqual(A.ap(DT.success(f), DT.failure('a')), DT.failure('a'));
        assert.deepStrictEqual(A.ap(DT.success(f), DT.partialSuccess('a', 1)), DT.partialSuccess('a', 2));
        assert.deepStrictEqual(A.ap(DT.success(f), DT.successR(1)), DT.successR(2));
        assert.deepStrictEqual(A.ap(DT.success(f), DT.failureR('a')), DT.failureR('a'));
        assert.deepStrictEqual(A.ap(DT.success(f), DT.partialSuccessR('a', 1)), DT.partialSuccessR('a', 2));

        assert.deepStrictEqual(A.ap(DT.successR(f), DT.success(1)), DT.success(2));
        assert.deepStrictEqual(A.ap(DT.successR(f), DT.failure('a')), DT.failure('a'));
        assert.deepStrictEqual(A.ap(DT.successR(f), DT.partialSuccess('a', 1)), DT.partialSuccess('a', 2));
        assert.deepStrictEqual(A.ap(DT.successR(f), DT.successR(1)), DT.successR(2));
        assert.deepStrictEqual(A.ap(DT.successR(f), DT.failureR('a')), DT.failureR('a'));
        assert.deepStrictEqual(A.ap(DT.successR(f), DT.partialSuccessR('a', 1)), DT.partialSuccessR('a', 2));

        assert.deepStrictEqual(A.ap(DT.partialSuccess('a', f), DT.success(1)), DT.partialSuccess('a', 2));
        assert.deepStrictEqual(A.ap(DT.partialSuccess('a', f), DT.failure('a')), DT.failure('aa'));
        assert.deepStrictEqual(A.ap(DT.partialSuccess('a', f), DT.partialSuccess('a', 1)), DT.partialSuccess('aa', 2));
        assert.deepStrictEqual(A.ap(DT.partialSuccess('a', f), DT.successR(1)), DT.partialSuccessR('a', 2));
        assert.deepStrictEqual(A.ap(DT.partialSuccess('a', f), DT.failureR('a')), DT.failureR('aa'));
        assert.deepStrictEqual(A.ap(DT.partialSuccess('a', f), DT.partialSuccessR('a', 1)), DT.partialSuccessR('aa', 2));

        assert.deepStrictEqual(A.ap(DT.partialSuccessR('a', f), DT.success(1)), DT.partialSuccess('a', 2));
        assert.deepStrictEqual(A.ap(DT.partialSuccessR('a', f), DT.failure('a')), DT.failure('aa'));
        assert.deepStrictEqual(A.ap(DT.partialSuccessR('a', f), DT.partialSuccess('a', 1)), DT.partialSuccess('aa', 2));
        assert.deepStrictEqual(A.ap(DT.partialSuccessR('a', f), DT.successR(1)), DT.partialSuccessR('a', 2));
        assert.deepStrictEqual(A.ap(DT.partialSuccessR('a', f), DT.failureR('a')), DT.failureR('aa'));
        assert.deepStrictEqual(A.ap(DT.partialSuccessR('a', f), DT.partialSuccessR('a', 1)), DT.partialSuccessR('aa', 2));
    }

    it('getApply', () => {
        const A = DT.getApply(semigroupString);
        assertAp(A);
    });

    function assertOf(A: Applicative2C<DT.URI, string>) {

        assert.deepStrictEqual(A.of(1), DT.success(1));
    }

    it('getApplicative', () => {
        const A = DT.getApplicative(semigroupString);
        assertAp(A);
        assertOf(A);
    });

    function assertChain(C: Chain2C<DT.URI, string>) {
        const f = (n: number) => n > 1 ? DT.success(n * 2) : DT.partialSuccess('b', n);
        const g = (n: number) => DT.failureR('c')
        const h = (n: number) => DT.initial

        const noValues = [
            DT.initial,
            DT.pending,
        ];

        noValues.forEach(noValue => {
            assert.deepStrictEqual(C.chain(noValue, f), noValue);
        });

        [DT.failure('a'), DT.failureR('a')].forEach(fail => {
            assert.deepStrictEqual(C.chain(fail, f), DT.failure('a'));
        });

        assert.deepStrictEqual(C.chain(DT.partialSuccess('a', 1), f), DT.partialSuccess('ab', 1));
        assert.deepStrictEqual(C.chain(DT.partialSuccess('a', 2), f), DT.partialSuccess('a', 4));
        assert.deepStrictEqual(C.chain(DT.partialSuccess('a', 1), g), DT.failureR('ac'));
        assert.deepStrictEqual(C.chain(DT.partialSuccess('a', 1), h), DT.initial);
        assert.deepStrictEqual(C.chain(DT.partialSuccessR('a', 1), f), DT.partialSuccess('ab', 1));
        assert.deepStrictEqual(C.chain(DT.partialSuccessR('a', 2), f), DT.partialSuccess('a', 4));
        assert.deepStrictEqual(C.chain(DT.partialSuccessR('a', 1), g), DT.failureR('ac'));
        assert.deepStrictEqual(C.chain(DT.partialSuccessR('a', 1), h), DT.initial);


        assert.deepStrictEqual(C.chain(DT.success(1), f), DT.partialSuccess('b', 1));
        assert.deepStrictEqual(C.chain(DT.success(2), f), DT.success(4));
        assert.deepStrictEqual(C.chain(DT.success(1), g), DT.failureR('c'));
        assert.deepStrictEqual(C.chain(DT.success(1), h), DT.initial);
        assert.deepStrictEqual(C.chain(DT.successR(1), f), DT.partialSuccess('b', 1));
        assert.deepStrictEqual(C.chain(DT.successR(2), f), DT.success(4));
        assert.deepStrictEqual(C.chain(DT.successR(1), g), DT.failureR('c'));
        assert.deepStrictEqual(C.chain(DT.successR(1), h), DT.initial);
    }

    it('getChain', () => {
        const C = DT.getChain(semigroupString);
        assertAp(C)
        assertChain(C)
    });

    it('getMonad', () => {
        const M = DT.getMonad(semigroupString);
        assertAp(M);;
        assertChain(M);
        assertOf(M);
    });

    it('getMonadThrow', () => {
        const M = DT.getMonadThrow(semigroupString);
        assertAp(M);;
        assertChain(M);
        assertOf(M);
        assert.deepStrictEqual(M.throwError('bla'), DT.failure('bla'))
    });
});
