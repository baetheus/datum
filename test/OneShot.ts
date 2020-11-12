import * as assert from 'assert';
import { left, right } from 'fp-ts/es6/Either';
import { eqNumber } from 'fp-ts/es6/Eq';
import { identity } from 'fp-ts/es6/function';
import { monoidString, monoidSum } from 'fp-ts/es6/Monoid';
import { none, some, option } from 'fp-ts/es6/Option';
import { ordString } from 'fp-ts/es6/Ord';
import { pipe } from 'fp-ts/es6/pipeable';
import { semigroupSum } from 'fp-ts/es6/Semigroup';
import { showString } from 'fp-ts/es6/Show';
import * as I from 'fp-ts/es6/Identity';
import { array } from 'fp-ts/es6/Array';

import * as D from '../src/OneShot';

const predicate = (n: number): boolean => n > 2;

describe('OneShot', () => {
  it('URI', () => {
    assert.strictEqual(D.URI, '@nll/datum/OneShot');
  });

  it('creates', () => {
    assert.deepStrictEqual(D.initial, { _tag: 'Initial' });
    assert.deepStrictEqual(D.pending, { _tag: 'Pending' });
    assert.deepStrictEqual(D.constInitial(), { _tag: 'Initial' });
    assert.deepStrictEqual(D.constPending(), { _tag: 'Pending' });
    assert.deepStrictEqual(D.complete(1), { _tag: 'Complete', value: 1 });
  });

  it('fold', () => {
    const onInitial = () => 'initial';
    const onPending = () => `pending`;
    const onComplete = (s: string) => `Complete${s.length}`;

    const fold = D.fold(onInitial, onPending, onComplete);

    assert.strictEqual(fold(D.initial), 'initial');
    assert.strictEqual(fold(D.pending), 'pending');
    assert.strictEqual(fold(D.complete('abc')), 'Complete3');
  });

  it('getOrElse', () => {
    assert.strictEqual(
      pipe(
        D.initial,
        D.getOrElse(
          () => 0,
          () => 1
        )
      ),
      0
    );
    assert.strictEqual(
      pipe(
        D.pending,
        D.getOrElse(
          () => 0,
          () => 1
        )
      ),
      1
    );
    assert.strictEqual(
      pipe(
        D.complete(3),
        D.getOrElse(
          () => 0,
          () => 1
        )
      ),
      3
    );
  });

  it('getEq', () => {
    const { equals } = D.getEq(eqNumber);

    assert.strictEqual(equals(D.initial, D.initial), true);
    assert.strictEqual(equals(D.initial, D.pending), false);
    assert.strictEqual(equals(D.initial, D.complete(1)), false);

    assert.strictEqual(equals(D.pending, D.initial), false);
    assert.strictEqual(equals(D.pending, D.pending), true);
    assert.strictEqual(equals(D.pending, D.complete(2)), false);

    assert.strictEqual(equals(D.complete(1), D.initial), false);
    assert.strictEqual(equals(D.complete(1), D.pending), false);
    assert.strictEqual(equals(D.complete(1), D.complete(1)), true);
  });

  it('map', () => {
    const f = (n: number) => n * 2;

    assert.deepStrictEqual(D.OneShot.map(D.initial, f), D.initial);
    assert.deepStrictEqual(D.OneShot.map(D.pending, f), D.pending);
    assert.deepStrictEqual(D.OneShot.map(D.complete(2), f), D.complete(4));
  });

  it('getOrd', () => {
    const { compare } = D.getOrd(ordString);

    assert.deepStrictEqual(compare(D.initial, D.initial), 0);
    assert.deepStrictEqual(compare(D.initial, D.pending), -1);
    assert.deepStrictEqual(compare(D.initial, D.complete('a')), -1);

    assert.deepStrictEqual(compare(D.pending, D.initial), 1);
    assert.deepStrictEqual(compare(D.pending, D.pending), 0);
    assert.deepStrictEqual(compare(D.pending, D.complete('a')), -1);

    assert.deepStrictEqual(compare(D.complete('a'), D.initial), 1);
    assert.deepStrictEqual(compare(D.complete('a'), D.pending), 1);
    assert.deepStrictEqual(compare(D.complete('a'), D.complete('a')), 0);
    assert.deepStrictEqual(compare(D.complete('a'), D.complete('b')), -1);
  });

  /**
   * 1. Identity: `A.ap(A.of(a => a), fa) = fa`
   * 2. Homomorphism: `A.ap(A.of(ab), A.of(a)) = A.of(ab(a))`
   * 3. Interchange: `A.ap(fab, A.of(a)) = A.ap(A.of(ab => ab(a)), fab)`
   */
  it('ap', () => {
    const f = (n: number) => n * 2;

    assert.deepStrictEqual(D.OneShot.ap(D.initial, D.initial), D.initial);
    assert.deepStrictEqual(D.OneShot.ap(D.initial, D.pending), D.initial);
    assert.deepStrictEqual(D.OneShot.ap(D.initial, D.complete(1)), D.initial);

    assert.deepStrictEqual(D.OneShot.ap(D.pending, D.initial), D.initial);
    assert.deepStrictEqual(D.OneShot.ap(D.pending, D.pending), D.pending);
    assert.deepStrictEqual(D.OneShot.ap(D.pending, D.complete(1)), D.pending);

    assert.deepStrictEqual(D.OneShot.ap(D.complete(f), D.initial), D.initial);
    assert.deepStrictEqual(D.OneShot.ap(D.complete(f), D.pending), D.pending);
    assert.deepStrictEqual(
      D.OneShot.ap(D.complete(f), D.complete(1)),
      D.complete(2)
    );
  });

  it('chain', () => {
    const f = (n: number) => D.complete(n * 2);
    const g = () => D.initial;

    assert.deepStrictEqual(D.OneShot.chain(D.initial, f), D.initial);
    assert.deepStrictEqual(D.OneShot.chain(D.initial, g), D.initial);

    assert.deepStrictEqual(D.OneShot.chain(D.pending, f), D.pending);
    assert.deepStrictEqual(D.OneShot.chain(D.pending, g), D.pending);

    assert.deepStrictEqual(D.OneShot.chain(D.complete(1), f), D.complete(2));
    assert.deepStrictEqual(D.OneShot.chain(D.complete(1), g), D.initial);
  });

  /**
   * `Alt` instances are required to satisfy the following laws:
   *
   * 1. Associativity: `A.alt(A.alt(fa, ga), ha) = A.alt(fa, A.alt(ga, ha))`
   * 2. Distributivity: `A.map(A.alt(fa, ga), ab) = A.alt(A.map(fa, ab), A.map(ga, ab))`
   */
  it('alt', () => {
    const f = (n: number) => n * 2;
    const alt = D.OneShot.alt;
    const map = D.OneShot.map;

    assert.deepStrictEqual(
      alt(
        alt(D.initial, () => D.pending),
        () => D.pending
      ),
      alt(D.initial, () => alt(D.pending, () => D.pending))
    );
    assert.deepStrictEqual(
      alt(
        alt(D.pending, () => D.initial),
        () => D.pending
      ),
      alt(D.pending, () => alt(D.initial, () => D.pending))
    );
    assert.deepStrictEqual(
      alt(
        alt(D.pending, () => D.complete(1)),
        () => D.pending
      ),
      alt(D.pending, () => alt(D.complete(1), () => D.pending))
    );

    assert.deepStrictEqual(
      map(
        alt(D.initial, () => D.pending),
        f
      ),
      alt(map(D.initial, f), () => map(D.pending, f))
    );
    assert.deepStrictEqual(
      map(
        alt(D.pending, () => D.initial),
        f
      ),
      alt(map(D.pending, f), () => map(D.initial, f))
    );
    assert.deepStrictEqual(
      map(
        alt(D.initial, () => D.complete(1)),
        f
      ),
      alt(map(D.initial, f), () => map(D.complete(1), f))
    );
  });

  it('extend', () => {
    const f = D.getOrElse(
      () => 0,
      () => 1
    );
    assert.deepStrictEqual(D.OneShot.extend(D.complete(2), f), D.complete(2));
    assert.deepStrictEqual(D.OneShot.extend(D.initial, f), D.complete(0));
  });

  it('fromNullable', () => {
    assert.deepStrictEqual(D.fromNullable(2), D.complete(2));
    assert.deepStrictEqual(D.fromNullable(null), D.initial);
    assert.deepStrictEqual(D.fromNullable(undefined), D.initial);
  });

  // TODO Fix these tests!
  it('traverse', () => {
    assert.deepStrictEqual(
      D.OneShot.traverse(option)(D.initial, () => none),
      some(D.initial)
    );
    assert.deepStrictEqual(
      D.OneShot.traverse(option)(D.pending, () => none),
      some(D.pending)
    );
    assert.deepStrictEqual(
      D.OneShot.traverse(option)(D.complete('foo'), (a) =>
        a.length >= 2 ? some(a) : none
      ),
      some(D.complete('foo'))
    );
    assert.deepStrictEqual(
      D.OneShot.traverse(option)(D.complete(1), (a) =>
        a >= 2 ? some(a) : none
      ),
      none
    );
    assert.deepStrictEqual(
      D.OneShot.traverse(option)(D.complete(3), (a) =>
        a >= 2 ? some(a) : none
      ),
      some(D.complete(3))
    );
  });

  // TODO Fix these tests!
  it('sequence', () => {
    assert.deepStrictEqual(D.OneShot.sequence(array)(D.initial), [D.initial]);
    assert.deepStrictEqual(D.OneShot.sequence(array)(D.pending), [D.pending]);
    assert.deepStrictEqual(D.OneShot.sequence(array)(D.complete([1, 2])), [
      D.complete(1),
      D.complete(2),
    ]);
  });

  it('reduce', () => {
    assert.strictEqual(
      D.OneShot.reduce(D.initial, 2, (b, a) => b + a),
      2
    );
    assert.strictEqual(
      D.OneShot.reduce(D.pending, 2, (b, a) => b + a),
      2
    );
    assert.strictEqual(
      D.OneShot.reduce(D.complete(3), 2, (b, a) => b + a),
      5
    );
  });

  it('foldMap', () => {
    const foldMap = D.OneShot.foldMap(monoidString);
    assert.strictEqual(foldMap(D.initial, identity), '');
    assert.strictEqual(foldMap(D.pending, identity), '');
    assert.strictEqual(foldMap(D.complete('a'), identity), 'a');
  });

  it('reduceRight', () => {
    const reduceRight = D.OneShot.reduceRight;
    const concat = (a: string, acc: string) => acc + a;
    assert.strictEqual(reduceRight(D.initial, 'init', concat), 'init');
    assert.strictEqual(reduceRight(D.pending, 'init', concat), 'init');
    assert.strictEqual(reduceRight(D.complete('a'), 'init', concat), 'inita');
  });

  it('getSemigroup', () => {
    const S = D.getSemigroup(semigroupSum);
    assert.deepStrictEqual(S.concat(D.initial, D.initial), D.initial);
    assert.deepStrictEqual(S.concat(D.pending, D.pending), D.pending);
    assert.deepStrictEqual(S.concat(D.complete(1), D.initial), D.initial);
    assert.deepStrictEqual(S.concat(D.initial, D.complete(1)), D.initial);
    assert.deepStrictEqual(
      S.concat(D.complete(1), D.complete(2)),
      D.complete(3)
    );
  });

  it('getApplySemigroup', () => {
    const S = D.getApplySemigroup(semigroupSum);
    assert.deepStrictEqual(S.concat(D.initial, D.initial), D.initial);
    assert.deepStrictEqual(S.concat(D.pending, D.pending), D.pending);
    assert.deepStrictEqual(S.concat(D.complete(1), D.initial), D.initial);
    assert.deepStrictEqual(S.concat(D.initial, D.complete(1)), D.initial);
    assert.deepStrictEqual(
      S.concat(D.complete(1), D.complete(2)),
      D.complete(3)
    );
  });

  it('getApplyMonoid', () => {
    const M = D.getApplyMonoid(monoidSum);
    assert.deepStrictEqual(M.concat(M.empty, D.initial), D.initial);
    assert.deepStrictEqual(M.concat(D.initial, M.empty), D.initial);
    assert.deepStrictEqual(M.concat(M.empty, D.pending), D.pending);
    assert.deepStrictEqual(M.concat(D.pending, M.empty), D.pending);
    assert.deepStrictEqual(M.concat(M.empty, D.complete(1)), D.complete(1));
    assert.deepStrictEqual(M.concat(D.complete(1), M.empty), D.complete(1));
  });

  it('elem', () => {
    assert.deepStrictEqual(D.elem(eqNumber)(2, D.initial), false);
    assert.deepStrictEqual(D.elem(eqNumber)(2, D.pending), false);
    assert.deepStrictEqual(D.elem(eqNumber)(2, D.complete(2)), true);
    assert.deepStrictEqual(D.elem(eqNumber)(1, D.complete(2)), false);
  });

  it('isInitial', () => {
    assert.deepStrictEqual(D.isInitial(D.initial), true);
    assert.deepStrictEqual(D.isInitial(D.pending), false);
    assert.deepStrictEqual(D.isInitial(D.complete(1)), false);
  });

  it('isPending', () => {
    assert.deepStrictEqual(D.isPending(D.initial), false);
    assert.deepStrictEqual(D.isPending(D.pending), true);
    assert.deepStrictEqual(D.isPending(D.complete(1)), false);
  });

  it('isComplete', () => {
    assert.deepStrictEqual(D.isComplete(D.initial), false);
    assert.deepStrictEqual(D.isComplete(D.pending), false);
    assert.deepStrictEqual(D.isComplete(D.complete(1)), true);
  });

  it('exists', () => {
    const predicate = (a: number) => a === 2;
    assert.deepStrictEqual(pipe(D.initial, D.exists(predicate)), false);
    assert.deepStrictEqual(pipe(D.complete(1), D.exists(predicate)), false);
    assert.deepStrictEqual(pipe(D.complete(2), D.exists(predicate)), true);
  });

  it('compact', () => {
    assert.deepStrictEqual(D.OneShot.compact(D.initial), D.initial);
    assert.deepStrictEqual(D.OneShot.compact(D.pending), D.pending);
    assert.deepStrictEqual(D.OneShot.compact(D.complete(none)), D.initial);
    assert.deepStrictEqual(
      D.OneShot.compact(D.complete(some('123'))),
      D.complete('123')
    );
  });

  it('separate', () => {
    assert.deepStrictEqual(D.OneShot.separate(D.initial), {
      left: D.initial,
      right: D.initial,
    });
    assert.deepStrictEqual(D.OneShot.separate(D.pending), {
      left: D.initial,
      right: D.initial,
    });
    assert.deepStrictEqual(D.OneShot.separate(D.complete(right('123'))), {
      left: D.initial,
      right: D.complete('123'),
    });
  });

  it('filter', () => {
    const predicate = (a: number) => a === 2;
    assert.deepStrictEqual(D.OneShot.filter(D.initial, predicate), D.initial);
    assert.deepStrictEqual(
      D.OneShot.filter(D.complete(1), predicate),
      D.initial
    );
    assert.deepStrictEqual(
      D.OneShot.filter(D.complete(2), predicate),
      D.complete(2)
    );
  });

  it('filterMap', () => {
    const f = (n: number) => (predicate(n) ? some(n + 1) : none);
    assert.deepStrictEqual(D.OneShot.filterMap(D.initial, f), D.initial);
    assert.deepStrictEqual(D.OneShot.filterMap(D.complete(1), f), D.initial);
    assert.deepStrictEqual(
      D.OneShot.filterMap(D.complete(3), f),
      D.complete(4)
    );
  });

  it('partition', () => {
    assert.deepStrictEqual(D.OneShot.partition(D.initial, predicate), {
      left: D.initial,
      right: D.initial,
    });
    assert.deepStrictEqual(D.OneShot.partition(D.complete(1), predicate), {
      left: D.complete(1),
      right: D.initial,
    });
    assert.deepStrictEqual(D.OneShot.partition(D.complete(3), predicate), {
      left: D.initial,
      right: D.complete(3),
    });
  });

  it('partitionMap', () => {
    const f = (n: number) => (predicate(n) ? right(n + 1) : left(n - 1));
    assert.deepStrictEqual(D.OneShot.partitionMap(D.initial, f), {
      left: D.initial,
      right: D.initial,
    });
    assert.deepStrictEqual(D.OneShot.partitionMap(D.complete(1), f), {
      left: D.complete(0),
      right: D.initial,
    });
    assert.deepStrictEqual(D.OneShot.partitionMap(D.complete(3), f), {
      left: D.initial,
      right: D.complete(4),
    });
  });

  // TODO Fix these tests
  it('wither', () => {
    const witherIdentity = D.OneShot.wither(I.identity);
    const f = (n: number) => I.identity.of(predicate(n) ? some(n + 1) : none);
    assert.deepStrictEqual(
      witherIdentity(D.initial, f),
      I.identity.of(D.initial)
    );
    assert.deepStrictEqual(
      witherIdentity(D.pending, f),
      I.identity.of(D.pending)
    );
    assert.deepStrictEqual(
      witherIdentity(D.complete(1), f),
      I.identity.of(D.initial)
    );
    assert.deepStrictEqual(
      witherIdentity(D.complete(3), f),
      I.identity.of(D.complete(4))
    );
  });

  // TODO Fix these tests
  it('wilt', () => {
    const wiltIdentity = D.OneShot.wilt(I.identity);
    const f = (n: number) =>
      I.identity.of(predicate(n) ? right(n + 1) : left(n - 1));
    assert.deepStrictEqual(
      wiltIdentity(D.initial, f),
      I.identity.of({ left: D.initial, right: D.initial })
    );
    assert.deepStrictEqual(
      wiltIdentity(D.complete(1), f),
      I.identity.of({ left: D.complete(0), right: D.initial })
    );
    assert.deepStrictEqual(
      wiltIdentity(D.complete(3), f),
      I.identity.of({ left: D.initial, right: D.complete(4) })
    );
  });

  it('getShow', () => {
    const S = D.getShow(showString);
    assert.strictEqual(S.show(D.initial), `Initial`);
    assert.strictEqual(S.show(D.pending), `Pending`);
    assert.strictEqual(S.show(D.complete('a')), `Complete("a")`);
  });

  it('fromEither', () => {
    assert.strictEqual(D.fromEither(left('a')), D.initial);
    assert.deepStrictEqual(D.fromEither(right(1)), D.complete(1));
  });
});
