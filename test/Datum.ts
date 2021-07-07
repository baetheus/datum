import * as assert from 'assert';
import { left, right } from 'fp-ts/es6/Either';
import { eqNumber } from 'fp-ts/es6/Eq';
import { identity } from 'fp-ts/es6/function';
import { monoidString, monoidSum } from 'fp-ts/es6/Monoid';
import { none, some, option } from 'fp-ts/es6/Option';
import { ordString } from 'fp-ts/es6/Ord';
import { pipe } from 'fp-ts/es6/pipeable';
import { Semigroup, semigroupSum } from 'fp-ts/es6/Semigroup';
import { showString } from 'fp-ts/es6/Show';
import * as I from 'fp-ts/es6/Identity';
import { array } from 'fp-ts/es6/Array';

import * as D from '../src/Datum';

const predicate = (n: number): boolean => n > 2;

describe('Datum', () => {
  it('URI', () => {
    assert.strictEqual(D.URI, '@nll/datum/Datum');
  });

  it('creates', () => {
    assert.deepStrictEqual(D.initial, { _tag: 'Initial' });
    assert.deepStrictEqual(D.pending, { _tag: 'Pending' });
    assert.deepStrictEqual(D.constInitial(), { _tag: 'Initial' });
    assert.deepStrictEqual(D.constPending(), { _tag: 'Pending' });
    assert.deepStrictEqual(D.refresh(1), { _tag: 'Refresh', value: 1 });
    assert.deepStrictEqual(D.replete(1), { _tag: 'Replete', value: 1 });
  });

  it('fold', () => {
    const onInitial = () => 'initial';
    const onPending = () => `pending`;
    const onRefresh = (s: string) => `refresh${s.length}`;
    const onReplete = (s: string) => `replete${s.length}`;

    const fold = D.fold(onInitial, onPending, onRefresh, onReplete);

    assert.strictEqual(fold(D.initial), 'initial');
    assert.strictEqual(fold(D.pending), 'pending');
    assert.strictEqual(fold(D.refresh('abc')), 'refresh3');
    assert.strictEqual(fold(D.replete('abc')), 'replete3');
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
        D.refresh(2),
        D.getOrElse(
          () => 0,
          () => 1
        )
      ),
      2
    );
    assert.strictEqual(
      pipe(
        D.replete(3),
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
    assert.strictEqual(equals(D.initial, D.refresh(1)), false);
    assert.strictEqual(equals(D.initial, D.replete(1)), false);

    assert.strictEqual(equals(D.pending, D.initial), false);
    assert.strictEqual(equals(D.pending, D.pending), true);
    assert.strictEqual(equals(D.pending, D.refresh(1)), false);
    assert.strictEqual(equals(D.pending, D.replete(2)), false);

    assert.strictEqual(equals(D.refresh(1), D.initial), false);
    assert.strictEqual(equals(D.refresh(1), D.pending), false);
    assert.strictEqual(equals(D.refresh(1), D.refresh(1)), true);
    assert.strictEqual(equals(D.refresh(1), D.replete(1)), false);

    assert.strictEqual(equals(D.replete(1), D.initial), false);
    assert.strictEqual(equals(D.replete(1), D.pending), false);
    assert.strictEqual(equals(D.replete(1), D.refresh(1)), false);
    assert.strictEqual(equals(D.replete(1), D.replete(1)), true);
  });

  it('map', () => {
    const f = (n: number) => n * 2;

    assert.deepStrictEqual(D.Functor.map(D.initial, f), D.initial);
    assert.deepStrictEqual(D.Functor.map(D.pending, f), D.pending);
    assert.deepStrictEqual(D.Functor.map(D.replete(2), f), D.replete(4));
    assert.deepStrictEqual(D.Functor.map(D.refresh(2), f), D.refresh(4));
  });

  it('getOrd', () => {
    const { compare } = D.getOrd(ordString);

    assert.deepStrictEqual(compare(D.initial, D.initial), 0);
    assert.deepStrictEqual(compare(D.initial, D.pending), -1);
    assert.deepStrictEqual(compare(D.initial, D.refresh('a')), -1);
    assert.deepStrictEqual(compare(D.initial, D.replete('a')), -1);

    assert.deepStrictEqual(compare(D.pending, D.initial), 1);
    assert.deepStrictEqual(compare(D.pending, D.pending), 0);
    assert.deepStrictEqual(compare(D.pending, D.refresh('a')), -1);
    assert.deepStrictEqual(compare(D.pending, D.replete('a')), -1);

    assert.deepStrictEqual(compare(D.refresh('a'), D.initial), 1);
    assert.deepStrictEqual(compare(D.refresh('a'), D.pending), 1);
    assert.deepStrictEqual(compare(D.refresh('a'), D.refresh('a')), 0);
    assert.deepStrictEqual(compare(D.refresh('a'), D.refresh('b')), -1);
    assert.deepStrictEqual(compare(D.refresh('a'), D.replete('a')), -1);

    assert.deepStrictEqual(compare(D.replete('a'), D.initial), 1);
    assert.deepStrictEqual(compare(D.replete('a'), D.pending), 1);
    assert.deepStrictEqual(compare(D.replete('a'), D.refresh('a')), 1);
    assert.deepStrictEqual(compare(D.replete('a'), D.replete('a')), 0);
    assert.deepStrictEqual(compare(D.replete('a'), D.replete('b')), -1);
  });

  /**
   * 1. Identity: `A.ap(A.of(a => a), fa) = fa`
   * 2. Homomorphism: `A.ap(A.of(ab), A.of(a)) = A.of(ab(a))`
   * 3. Interchange: `A.ap(fab, A.of(a)) = A.ap(A.of(ab => ab(a)), fab)`
   */
   it('ap', () => {
    const f = (n: number) => n * 2;

    assert.deepStrictEqual(D.Apply.ap(D.initial, D.initial), D.initial);
    assert.deepStrictEqual(D.Apply.ap(D.initial, D.pending), D.initial);
    assert.deepStrictEqual(D.Apply.ap(D.initial, D.refresh(1)), D.initial);
    assert.deepStrictEqual(D.Apply.ap(D.initial, D.replete(1)), D.initial);

    assert.deepStrictEqual(D.Apply.ap(D.pending, D.initial), D.pending);
    assert.deepStrictEqual(D.Apply.ap(D.pending, D.pending), D.pending);
    assert.deepStrictEqual(D.Apply.ap(D.pending, D.refresh(1)), D.pending);
    assert.deepStrictEqual(D.Apply.ap(D.pending, D.replete(1)), D.pending);

    assert.deepStrictEqual(D.Apply.ap(D.refresh(f), D.initial), D.initial);
    assert.deepStrictEqual(D.Apply.ap(D.refresh(f), D.pending), D.pending);
    assert.deepStrictEqual(
      D.Apply.ap(D.refresh(f), D.refresh(1)),
      D.refresh(2)
    );
    assert.deepStrictEqual(
      D.Apply.ap(D.refresh(f), D.replete(1)),
      D.replete(2)
    );

    assert.deepStrictEqual(D.Apply.ap(D.replete(f), D.initial), D.initial);
    assert.deepStrictEqual(D.Apply.ap(D.replete(f), D.pending), D.pending);
    assert.deepStrictEqual(
      D.Apply.ap(D.replete(f), D.refresh(1)),
      D.refresh(2)
    );
    assert.deepStrictEqual(
      D.Apply.ap(D.replete(f), D.replete(1)),
      D.replete(2)
    );
  });

  it('chain', () => {
    const f = (n: number) => D.replete(n * 2);
    const g = () => D.initial;

    assert.deepStrictEqual(D.Chain.chain(D.initial, f), D.initial);
    assert.deepStrictEqual(D.Chain.chain(D.initial, g), D.initial);

    assert.deepStrictEqual(D.Chain.chain(D.pending, f), D.pending);
    assert.deepStrictEqual(D.Chain.chain(D.pending, g), D.pending);

    assert.deepStrictEqual(D.Chain.chain(D.refresh(1), f), D.replete(2));
    assert.deepStrictEqual(D.Chain.chain(D.refresh(1), g), D.initial);

    assert.deepStrictEqual(D.Chain.chain(D.replete(1), f), D.replete(2));
    assert.deepStrictEqual(D.Chain.chain(D.replete(1), g), D.initial);
  });

  /**
   * `Alt` instances are required to satisfy the following laws:
   *
   * 1. Associativity: `A.alt(A.alt(fa, ga), ha) = A.alt(fa, A.alt(ga, ha))`
   * 2. Distributivity: `A.map(A.alt(fa, ga), ab) = A.alt(A.map(fa, ab), A.map(ga, ab))`
   */
  it('alt', () => {
    const f = (n: number) => n * 2;
    const alt = D.Alt.alt;
    const map = D.Alt.map;

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
        alt(D.pending, () => D.refresh(1)),
        () => D.pending
      ),
      alt(D.pending, () => alt(D.refresh(1), () => D.pending))
    );
    assert.deepStrictEqual(
      alt(
        alt(D.pending, () => D.replete(1)),
        () => D.pending
      ),
      alt(D.pending, () => alt(D.replete(1), () => D.pending))
    );
    assert.deepStrictEqual(
      alt(
        alt(D.refresh(1), () => D.replete(1)),
        () => D.pending
      ),
      alt(D.refresh(1), () => alt(D.replete(1), () => D.pending))
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
        alt(D.pending, () => D.refresh(1)),
        f
      ),
      alt(map(D.pending, f), () => map(D.refresh(1), f))
    );
    assert.deepStrictEqual(
      map(
        alt(D.initial, () => D.replete(1)),
        f
      ),
      alt(map(D.initial, f), () => map(D.replete(1), f))
    );
  });

  it('extend', () => {
    const f = D.getOrElse(
      () => 0,
      () => 1
    );
    assert.deepStrictEqual(D.Extend.extend(D.replete(2), f), D.replete(2));
    assert.deepStrictEqual(D.Extend.extend(D.initial, f), D.replete(0));
  });

  it('fromNullable', () => {
    assert.deepStrictEqual(D.fromNullable(2), D.replete(2));
    assert.deepStrictEqual(D.fromNullable(null), D.initial);
    assert.deepStrictEqual(D.fromNullable(undefined), D.initial);
  });

  // TODO Fix these tests!
  it('traverse', () => {
    assert.deepStrictEqual(
      D.Traversable.traverse(option)(D.initial, () => none),
      some(D.initial)
    );
    assert.deepStrictEqual(
      D.Traversable.traverse(option)(D.pending, () => none),
      some(D.pending)
    );
    assert.deepStrictEqual(
      D.Traversable.traverse(option)(D.refresh('foo'), a =>
        a.length >= 2 ? some(a) : none
      ),
      some(D.refresh('foo'))
    );
    assert.deepStrictEqual(
      D.Traversable.traverse(option)(D.refresh(1), a => (a >= 2 ? some(a) : none)),
      none
    );
    assert.deepStrictEqual(
      D.Traversable.traverse(option)(D.refresh(3), a => (a >= 2 ? some(a) : none)),
      some(D.refresh(3))
    );
    assert.deepStrictEqual(
      D.Traversable.traverse(option)(D.replete('foo'), a =>
        a.length >= 2 ? some(a) : none
      ),
      some(D.replete('foo'))
    );
    assert.deepStrictEqual(
      D.Traversable.traverse(option)(D.replete(1), a => (a >= 2 ? some(a) : none)),
      none
    );
    assert.deepStrictEqual(
      D.Traversable.traverse(option)(D.replete(3), a => (a >= 2 ? some(a) : none)),
      some(D.replete(3))
    );
  });

  // TODO Fix these tests!
  it('sequence', () => {
    assert.deepStrictEqual(D.Traversable.sequence(array)(D.initial), [D.initial]);
    assert.deepStrictEqual(D.Traversable.sequence(array)(D.pending), [D.pending]);
    assert.deepStrictEqual(D.Traversable.sequence(array)(D.refresh([1, 2])), [
      D.refresh(1),
      D.refresh(2)
    ]);
    assert.deepStrictEqual(D.Traversable.sequence(array)(D.replete([1, 2])), [
      D.replete(1),
      D.replete(2)
    ]);
  });

  it('reduce', () => {
    assert.strictEqual(
      D.Foldable.reduce(D.initial, 2, (b, a) => b + a),
      2
    );
    assert.strictEqual(
      D.Foldable.reduce(D.pending, 2, (b, a) => b + a),
      2
    );
    assert.strictEqual(
      D.Foldable.reduce(D.refresh(3), 2, (b, a) => b + a),
      5
    );
    assert.strictEqual(
      D.Foldable.reduce(D.replete(3), 2, (b, a) => b + a),
      5
    );
  });

  it('foldMap', () => {
    const foldMap = D.Foldable.foldMap(monoidString);
    assert.strictEqual(foldMap(D.initial, identity), '');
    assert.strictEqual(foldMap(D.pending, identity), '');
    assert.strictEqual(foldMap(D.refresh('a'), identity), 'a');
    assert.strictEqual(foldMap(D.replete('a'), identity), 'a');
  });

  it('reduceRight', () => {
    const reduceRight = D.Foldable.reduceRight;
    const concat = (a: string, acc: string) => acc + a;
    assert.strictEqual(reduceRight(D.initial, 'init', concat), 'init');
    assert.strictEqual(reduceRight(D.pending, 'init', concat), 'init');
    assert.strictEqual(reduceRight(D.refresh('a'), 'init', concat), 'inita');
    assert.strictEqual(reduceRight(D.replete('a'), 'init', concat), 'inita');
  });

  function assertSemigroup(S: Semigroup<D.Datum<number>>) {

    const triples = [
      [D.initial, D.initial, D.initial],
      [D.initial, D.pending, D.pending],
      [D.initial, D.refresh(1), D.refresh(1)],
      [D.initial, D.replete(1), D.replete(1)],
      [D.pending, D.pending, D.pending],
      [D.pending, D.refresh(1), D.refresh(1)],
      [D.pending, D.replete(1), D.refresh(1)],
      [D.refresh(1), D.refresh(1), D.refresh(2)],
      [D.refresh(1), D.replete(1), D.refresh(2)],
      [D.replete(1), D.replete(1), D.replete(2)]
    ];
    triples.forEach(([s1, s2, expected]) => {
      assert.deepStrictEqual(S.concat(s1, s2), expected);
      assert.deepStrictEqual(S.concat(s2, s1), expected);
    });
  }

  it('getSemigroup', () => {
    const S = D.getSemigroup(semigroupSum);
    assertSemigroup(S);
  });

  it('getMonoid', () => {
    const M = D.getMonoid(monoidSum);
    assertSemigroup(M);
    const values = [
      D.initial,
      D.pending,
      D.refresh(1),
      D.replete(1)
    ];

    values.forEach(value => {
      assert.deepStrictEqual(M.concat(M.empty, value), value)
      assert.deepStrictEqual(M.concat(value, M.empty), value)
    });
  });

  it('getApplySemigroup', () => {
    const S = D.getApplySemigroup(semigroupSum);
    assert.deepStrictEqual(S.concat(D.initial, D.initial), D.initial);
    assert.deepStrictEqual(S.concat(D.pending, D.pending), D.pending);
    assert.deepStrictEqual(S.concat(D.refresh(1), D.initial), D.initial);
    assert.deepStrictEqual(S.concat(D.initial, D.refresh(1)), D.initial);
    assert.deepStrictEqual(S.concat(D.refresh(1), D.refresh(2)), D.refresh(3));
    assert.deepStrictEqual(S.concat(D.replete(1), D.initial), D.initial);
    assert.deepStrictEqual(S.concat(D.initial, D.replete(1)), D.initial);
    assert.deepStrictEqual(S.concat(D.replete(1), D.refresh(2)), D.refresh(3));
    assert.deepStrictEqual(S.concat(D.refresh(1), D.replete(2)), D.replete(3));
    assert.deepStrictEqual(S.concat(D.replete(1), D.replete(2)), D.replete(3));
  });

  it('elem', () => {
    assert.deepStrictEqual(D.elem(eqNumber)(2, D.initial), false);
    assert.deepStrictEqual(D.elem(eqNumber)(2, D.pending), false);
    assert.deepStrictEqual(D.elem(eqNumber)(2, D.refresh(2)), true);
    assert.deepStrictEqual(D.elem(eqNumber)(1, D.refresh(2)), false);
    assert.deepStrictEqual(D.elem(eqNumber)(2, D.replete(2)), true);
    assert.deepStrictEqual(D.elem(eqNumber)(1, D.replete(2)), false);
  });

  it('isInitial', () => {
    assert.deepStrictEqual(D.isInitial(D.initial), true);
    assert.deepStrictEqual(D.isInitial(D.pending), false);
    assert.deepStrictEqual(D.isInitial(D.refresh(1)), false);
    assert.deepStrictEqual(D.isInitial(D.replete(1)), false);
  });

  it('isPending', () => {
    assert.deepStrictEqual(D.isPending(D.initial), false);
    assert.deepStrictEqual(D.isPending(D.pending), true);
    assert.deepStrictEqual(D.isPending(D.refresh(1)), false);
    assert.deepStrictEqual(D.isPending(D.replete(1)), false);
  });

  it('isRefresh', () => {
    assert.deepStrictEqual(D.isRefresh(D.initial), false);
    assert.deepStrictEqual(D.isRefresh(D.pending), false);
    assert.deepStrictEqual(D.isRefresh(D.refresh(1)), true);
    assert.deepStrictEqual(D.isRefresh(D.replete(1)), false);
  });

  it('isReplete', () => {
    assert.deepStrictEqual(D.isReplete(D.initial), false);
    assert.deepStrictEqual(D.isReplete(D.pending), false);
    assert.deepStrictEqual(D.isReplete(D.refresh(1)), false);
    assert.deepStrictEqual(D.isReplete(D.replete(1)), true);
  });

  it('isValued', () => {
    assert.deepStrictEqual(D.isValued(D.initial), false);
    assert.deepStrictEqual(D.isValued(D.pending), false);
    assert.deepStrictEqual(D.isValued(D.refresh(1)), true);
    assert.deepStrictEqual(D.isValued(D.replete(1)), true);
  });

  it('exists', () => {
    const predicate = (a: number) => a === 2;
    assert.deepStrictEqual(pipe(D.initial, D.exists(predicate)), false);
    assert.deepStrictEqual(pipe(D.replete(1), D.exists(predicate)), false);
    assert.deepStrictEqual(pipe(D.replete(2), D.exists(predicate)), true);
  });

  it('compact', () => {
    assert.deepStrictEqual(D.Compactable.compact(D.initial), D.initial);
    assert.deepStrictEqual(D.Compactable.compact(D.pending), D.pending);
    assert.deepStrictEqual(D.Compactable.compact(D.refresh(none)), D.initial);
    assert.deepStrictEqual(
      D.Compactable.compact(D.refresh(some('123'))),
      D.refresh('123')
    );
    assert.deepStrictEqual(D.Compactable.compact(D.replete(none)), D.initial);
    assert.deepStrictEqual(
      D.Compactable.compact(D.replete(some('123'))),
      D.replete('123')
    );
  });

  it('separate', () => {
    assert.deepStrictEqual(D.Compactable.separate(D.initial), {
      left: D.initial,
      right: D.initial
    });
    assert.deepStrictEqual(D.Compactable.separate(D.pending), {
      left: D.initial,
      right: D.initial
    });
    assert.deepStrictEqual(D.Compactable.separate(D.refresh(left('123'))), {
      left: D.replete('123'),
      right: D.initial
    });
    assert.deepStrictEqual(D.Compactable.separate(D.replete(right('123'))), {
      left: D.initial,
      right: D.replete('123')
    });
  });

  it('filter', () => {
    const predicate = (a: number) => a === 2;
    assert.deepStrictEqual(D.Filterable.filter(D.initial, predicate), D.initial);
    assert.deepStrictEqual(D.Filterable.filter(D.refresh(1), predicate), D.initial);
    assert.deepStrictEqual(
      D.Filterable.filter(D.refresh(2), predicate),
      D.refresh(2)
    );
    assert.deepStrictEqual(D.Filterable.filter(D.replete(1), predicate), D.initial);
    assert.deepStrictEqual(
      D.Filterable.filter(D.replete(2), predicate),
      D.replete(2)
    );
  });

  it('filterMap', () => {
    const f = (n: number) => (predicate(n) ? some(n + 1) : none);
    assert.deepStrictEqual(D.Filterable.filterMap(D.initial, f), D.initial);
    assert.deepStrictEqual(D.Filterable.filterMap(D.replete(1), f), D.initial);
    assert.deepStrictEqual(D.Filterable.filterMap(D.replete(3), f), D.replete(4));
  });

  it('partition', () => {
    assert.deepStrictEqual(D.Filterable.partition(D.initial, predicate), {
      left: D.initial,
      right: D.initial
    });
    assert.deepStrictEqual(D.Filterable.partition(D.replete(1), predicate), {
      left: D.replete(1),
      right: D.initial
    });
    assert.deepStrictEqual(D.Filterable.partition(D.replete(3), predicate), {
      left: D.initial,
      right: D.replete(3)
    });
  });

  it('partitionMap', () => {
    const f = (n: number) => (predicate(n) ? right(n + 1) : left(n - 1));
    assert.deepStrictEqual(D.Filterable.partitionMap(D.initial, f), {
      left: D.initial,
      right: D.initial
    });
    assert.deepStrictEqual(D.Filterable.partitionMap(D.replete(1), f), {
      left: D.replete(0),
      right: D.initial
    });
    assert.deepStrictEqual(D.Filterable.partitionMap(D.replete(3), f), {
      left: D.initial,
      right: D.replete(4)
    });
  });

  // TODO Fix these tests
  it('wither', () => {
    const witherIdentity = D.Witherable.wither(I.identity);
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
      witherIdentity(D.refresh(1), f),
      I.identity.of(D.initial)
    );
    assert.deepStrictEqual(
      witherIdentity(D.refresh(3), f),
      I.identity.of(D.refresh(4))
    );
    assert.deepStrictEqual(
      witherIdentity(D.replete(1), f),
      I.identity.of(D.initial)
    );
    assert.deepStrictEqual(
      witherIdentity(D.replete(3), f),
      I.identity.of(D.replete(4))
    );
  });

  // TODO Fix these tests
  it('wilt', () => {
    const wiltIdentity = D.Witherable.wilt(I.identity);
    const f = (n: number) =>
      I.identity.of(predicate(n) ? right(n + 1) : left(n - 1));
    assert.deepStrictEqual(
      wiltIdentity(D.initial, f),
      I.identity.of({ left: D.initial, right: D.initial })
    );
    assert.deepStrictEqual(
      wiltIdentity(D.replete(1), f),
      I.identity.of({ left: D.replete(0), right: D.initial })
    );
    assert.deepStrictEqual(
      wiltIdentity(D.replete(3), f),
      I.identity.of({ left: D.initial, right: D.replete(4) })
    );
  });

  it('getShow', () => {
    const S = D.getShow(showString);
    assert.strictEqual(S.show(D.initial), `initial`);
    assert.strictEqual(S.show(D.pending), `pending`);
    assert.strictEqual(S.show(D.refresh('a')), `refresh("a")`);
    assert.strictEqual(S.show(D.replete('a')), `replete("a")`);
  });

  it('fromEither', () => {
    assert.strictEqual(D.fromEither(left('a')), D.initial);
    assert.deepStrictEqual(D.fromEither(right(1)), D.replete(1));
  });
});
