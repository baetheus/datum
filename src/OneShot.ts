/**
 * @since 3.3.0
 *
 * Represents a value of one of three possible types (a disjoint union).
 *
 * An instance of `OneShot` is either an instance of `Initial`, `Pending`, or `Complete`.
 * In effect it is a non-refreshable Datum.
 */
import { Alternative1 } from 'fp-ts/es6/Alternative';
import { Applicative } from 'fp-ts/es6/Applicative';
import { Compactable1, Separated } from 'fp-ts/es6/Compactable';
import { Either, isLeft, isRight } from 'fp-ts/es6/Either';
import { Eq } from 'fp-ts/es6/Eq';
import { Extend1 } from 'fp-ts/es6/Extend';
import { Filterable1 } from 'fp-ts/es6/Filterable';
import { Foldable1 } from 'fp-ts/es6/Foldable';
import { constFalse, identity, Predicate, constant } from 'fp-ts/es6/function';
import { HKT } from 'fp-ts/es6/HKT';
import { Monad1 } from 'fp-ts/es6/Monad';
import { MonadThrow1 } from 'fp-ts/es6/MonadThrow';
import { Monoid } from 'fp-ts/es6/Monoid';
import { isSome, Option } from 'fp-ts/es6/Option';
import { Ord } from 'fp-ts/es6/Ord';
import { Ordering } from 'fp-ts/es6/Ordering';
import { pipeable } from 'fp-ts/es6/pipeable';
import { Semigroup } from 'fp-ts/es6/Semigroup';
import { Show } from 'fp-ts/es6/Show';
import { Traversable1 } from 'fp-ts/es6/Traversable';
import { Witherable1 } from 'fp-ts/es6/Witherable';

/**
 * @since 3.3.0
 */
declare module 'fp-ts/es6/HKT' {
  interface URItoKind<A> {
    '@nll/datum/OneShot': OneShot<A>;
  }
}

/**
 * @since 3.3.0
 */
export const URI = '@nll/datum/OneShot';

/**
 * @since 3.3.0
 */
export type URI = typeof URI;

/**
 * @since 3.3.0
 */
export interface Initial {
  readonly _tag: 'Initial';
}

/**
 * @since 3.3.0
 */
export interface Pending {
  readonly _tag: 'Pending';
}

/**
 * @since 3.3.0
 */
export interface Complete<D> {
  readonly _tag: 'Complete';
  readonly value: D;
}

/**
 * @since 3.3.0
 */
export type OneShot<D> = Initial | Pending | Complete<D>;

/**
 * Constructs an initial `OneShot` holding no value.
 *
 * @since 3.3.0
 */
export const initial: OneShot<never> = {
  _tag: 'Initial',
};

/**
 * Constructs a pending `OneShot` holding no value.
 *
 * @since 3.3.0
 */
export const pending: OneShot<never> = {
  _tag: 'Pending',
};

/**
 * Constructs a new Complete `OneShot` holding a value.
 *
 * @since 3.3.0
 */
export const complete = <A = never>(value: A): OneShot<A> => ({
  _tag: 'Complete',
  value,
});

/**
 * @since 3.3.0
 */
export const constInitial = constant(initial);

/**
 * @since 3.3.0
 */
export const constPending = constant(pending);

/**
 * Takes a nullable value, if the value is not nully, turn it into a `Complete`, otherwise `Initial`.
 *
 * @since 3.3.0
 */
export const fromNullable = <A>(a: A | null | undefined): OneShot<A> =>
  a === null || a === undefined ? initial : complete(a);

/**
 * @since 3.3.0
 */
export const fold = <A, B>(
  onInitial: () => B,
  onPending: () => B,
  onComplete: (a: A) => B
) => (ma: OneShot<A>): B => {
  switch (ma._tag) {
    case 'Initial':
      return onInitial();
    case 'Pending':
      return onPending();
    case 'Complete':
      return onComplete(ma.value);
  }
};

/**
 * @since 3.3.0
 */
export const getShow = <A>(S: Show<A>): Show<OneShot<A>> => ({
  show: fold(
    constant('Initial'),
    constant('Pending'),
    (v) => `Complete(${S.show(v)})`
  ),
});

/**
 * @since 3.3.0
 */
export const getEq = <A>(E: Eq<A>): Eq<OneShot<A>> => ({
  equals: (x, y) =>
    x === y ||
    (isComplete(x) && isComplete(y) && E.equals(x.value, y.value)) ||
    (isInitial(x) && isInitial(y)) ||
    (isPending(x) && isPending(y)),
});

/**
 * Semigroup returning the left-most non-`Initial` and non-`Pending` value. If both operands
 * are `Complete`s then the inner values are appended using the provided
 * `Semigroup`
 *
 * @since 3.3.0
 */
export const getSemigroup = <A>(S: Semigroup<A>): Semigroup<OneShot<A>> => ({
  concat: (fx, fy): OneShot<A> =>
    fold<A, OneShot<A>>(
      constInitial,
      constant(
        fold<A, OneShot<A>>(constInitial, constPending, constPending)(fy)
      ),
      (x) =>
        fold<A, OneShot<A>>(constInitial, constPending, (y) =>
          complete(S.concat(x, y))
        )(fy)
    )(fx),
});

const constZero = constant<0>(0);
const constNegOne = constant<-1>(-1);
const constOne = constant<1>(1);

/**
 * The `Ord` instance allows `OneShot` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `OneShot` contains.
 *
 * `Initial` < `Pending` < `Refresh` | `Complete`
 *
 * @since 3.3.0
 */
export function getOrd<A>(O: Ord<A>): Ord<OneShot<A>> {
  return {
    equals: getEq(O).equals,
    compare: (xa, ya): Ordering =>
      fold<A, Ordering>(
        // x Initial
        constant(fold<A, Ordering>(constZero, constNegOne, constNegOne)(ya)),
        // x Pending
        constant(fold<A, Ordering>(constOne, constZero, constNegOne)(ya)),
        // x Complete
        (x) => fold<A, Ordering>(constOne, constOne, (y) => O.compare(x, y))(ya)
      )(xa),
  };
}

/**
 * `Apply` semigroup
 *
 * @since 3.3.0
 */
export const getApplySemigroup = <A>(S: Semigroup<A>): Semigroup<OneShot<A>> =>
  getSemigroup(S);

/**
 * @since 3.3.0
 */
export const getApplyMonoid = <A>(M: Monoid<A>): Monoid<OneShot<A>> => ({
  ...getApplySemigroup(M),
  empty: complete(M.empty),
});

/**
 * Returns `true` if the Async is an instance of `Initial`, `false` otherwise
 *
 * @since 3.3.0
 */
export const isInitial = <A>(ma: OneShot<A>): ma is Initial =>
  ma._tag === 'Initial';

/**
 * Returns `true` if the Async is an instance of `Pending`, `false` otherwise
 *
 * @since 3.3.0
 */
export const isPending = <A>(ma: OneShot<A>): ma is Pending =>
  ma._tag === 'Pending';

/**
 * Returns `true` if the Async is an instance of `Complete`, `false` otherwise
 *
 * @since 3.3.0
 */
export const isComplete = <A>(ma: OneShot<A>): ma is Complete<A> =>
  ma._tag === 'Complete';

/**
 * @since 3.3.0
 */
export const getOrElse = <A>(onInitial: () => A, onPending: () => A) => (
  ma: OneShot<A>
): A => fold<A, A>(onInitial, onPending, identity)(ma);

/**
 * @since 3.3.0
 */
export const elem = <A>(E: Eq<A>) => <E>(a: A, ma: OneShot<A>): boolean =>
  fold<A, boolean>(constFalse, constFalse, (b) => E.equals(a, b))(ma);

/**
 * Returns `false` if `Refresh` or returns the result of the application of the given predicate to the `Complete` value.
 *
 * @since 3.3.0
 */
export const exists = <A>(predicate: Predicate<A>) => <E>(
  ma: OneShot<A>
): boolean => fold<A, boolean>(constFalse, constFalse, predicate)(ma);

/**
 * @since 3.3.0
 */
const mapC = <A, B>(fa: OneShot<A>, f: (a: A) => B): OneShot<B> =>
  fold<A, OneShot<B>>(constInitial, constPending, (a) => complete(f(a)))(fa);

/**
 * @since 3.3.0
 */
const apC = <A, B>(fab: OneShot<(a: A) => B>, fa: OneShot<A>): OneShot<B> =>
  fold<(a: A) => B, OneShot<B>>(
    constInitial,
    () => fold<A, OneShot<B>>(constInitial, constPending, constPending)(fa),
    (f) =>
      fold<A, OneShot<B>>(constInitial, constPending, (a) => complete(f(a)))(fa)
  )(fab);

/**
 * @since 3.3.0
 */
const chainC = <A, B>(fa: OneShot<A>, f: (a: A) => OneShot<B>): OneShot<B> =>
  fold<A, OneShot<B>>(constInitial, constPending, f)(fa);

/**
 * @since 3.3.0
 */
const reduceC = <A, B>(fa: OneShot<A>, b: B, f: (b: B, a: A) => B): B =>
  fold<A, B>(
    () => b,
    () => b,
    (a) => f(b, a)
  )(fa);

/**
 * @since 3.3.0
 */
const foldMapC = <M>(M: Monoid<M>) => <A>(fa: OneShot<A>, f: (a: A) => M): M =>
  fold<A, M>(
    () => M.empty,
    () => M.empty,
    f
  )(fa);

/**
 * @since 3.3.0
 */
const reduceRightC = <A, B>(fa: OneShot<A>, b: B, f: (a: A, b: B) => B): B =>
  fold<A, B>(
    () => b,
    () => b,
    (a) => f(a, b)
  )(fa);

/**
 * @since 3.3.0
 */
const traverseC = <F>(F: Applicative<F>) => <A, B>(
  ta: OneShot<A>,
  f: (a: A) => HKT<F, B>
): HKT<F, OneShot<B>> =>
  fold<A, HKT<F, OneShot<B>>>(
    () => F.of(initial),
    () => F.of(pending),
    (a) => F.map(f(a), complete)
  )(ta);

/**
 * @since 3.3.0
 */
const sequenceC = <F>(F: Applicative<F>) => <A>(
  ta: OneShot<HKT<F, A>>
): HKT<F, OneShot<A>> =>
  fold<HKT<F, A>, HKT<F, OneShot<A>>>(
    () => F.of(initial),
    () => F.of(pending),
    (a) => F.map(a, complete)
  )(ta);

/**
 * @since 3.3.0
 */
const altC = <A>(fx: OneShot<A>, fy: () => OneShot<A>): OneShot<A> =>
  fold<A, OneShot<A>>(fy, fy, complete)(fx);

/**
 * @since 3.3.0
 */
const extendC = <A, B>(wa: OneShot<A>, f: (wa: OneShot<A>) => B): OneShot<B> =>
  complete(f(wa));

/**
 * @since 3.3.0
 */
const compactC = <A>(fa: OneShot<Option<A>>): OneShot<A> =>
  fold<Option<A>, OneShot<A>>(constInitial, constPending, (a) =>
    isSome(a) ? complete(a.value) : initial
  )(fa);

const defaultSeparate = {
  left: initial as OneShot<any>,
  right: initial as OneShot<any>,
};

/**
 * @since 3.3.0
 */
const separateC = <A, B>(
  fa: OneShot<Either<A, B>>
): Separated<OneShot<A>, OneShot<B>> => {
  const s = mapC(fa, (e) => ({
    left: isLeft(e) ? complete(e.left) : initial,
    right: isRight(e) ? complete(e.right) : initial,
  }));

  return getOrElse(
    () => defaultSeparate,
    () => defaultSeparate
  )(s);
};

/**
 * @since 3.3.0
 */
const filterC = <A>(fa: OneShot<A>, predicate: Predicate<A>): OneShot<A> =>
  fold<A, OneShot<A>>(constInitial, constPending, (a) =>
    predicate(a) ? fa : initial
  )(fa);

/**
 * @since 3.3.0
 */
const filterMapC = <A, B>(ma: OneShot<A>, f: (a: A) => Option<B>): OneShot<B> =>
  compactC(mapC(ma, f));

/**
 * @since 3.3.0
 */
const partitionC = <A>(
  fa: OneShot<A>,
  predicate: Predicate<A>
): Separated<OneShot<A>, OneShot<A>> => ({
  left: filterC(fa, (a) => !predicate(a)),
  right: filterC(fa, predicate),
});

/**
 * @since 3.3.0
 */
const partitionMapC = <A, B, C>(fa: OneShot<A>, f: (a: A) => Either<B, C>) =>
  separateC(mapC(fa, f));

/**
 * @since 3.3.0
 */
const witherC = <F>(F: Applicative<F>) => <A, B>(
  fa: OneShot<A>,
  f: (a: A) => HKT<F, Option<B>>
): HKT<F, OneShot<B>> =>
  fold<A, HKT<F, OneShot<B>>>(
    constant(F.of(initial)),
    constant(F.of(pending)),
    (a) => F.map(f(a), (o) => (isSome(o) ? complete(o.value) : initial))
  )(fa);

/**
 * @since 3.3.0
 */
const wiltC = <F>(F: Applicative<F>) => <A, B, C>(
  fa: OneShot<A>,
  f: (a: A) => HKT<F, Either<B, C>>
): HKT<F, Separated<OneShot<B>, OneShot<C>>> => {
  const s = mapC(fa, (a) =>
    F.map(f(a), (e) => ({
      left: isLeft(e) ? complete(e.left) : initial,
      right: isRight(e) ? complete(e.right) : initial,
    }))
  );
  return isComplete(s) ? s.value : F.of(defaultSeparate);
};

/**
 * @since 3.3.0
 */
const throwErrorC = <E, A>(e: E): OneShot<A> => initial;

/**
 * @since 3.3.0
 */
export const OneShot: Monad1<URI> &
  Foldable1<URI> &
  Traversable1<URI> &
  Alternative1<URI> &
  Extend1<URI> &
  Compactable1<URI> &
  Filterable1<URI> &
  Witherable1<URI> &
  MonadThrow1<URI> = {
  URI,
  map: mapC,
  of: complete,
  ap: apC,
  chain: chainC,
  reduce: reduceC,
  foldMap: foldMapC,
  reduceRight: reduceRightC,
  traverse: traverseC,
  sequence: sequenceC,
  zero: constInitial,
  alt: altC,
  extend: extendC,
  compact: compactC,
  separate: separateC,
  filter: filterC,
  filterMap: filterMapC,
  partition: partitionC,
  partitionMap: partitionMapC,
  wither: witherC,
  wilt: wiltC,
  throwError: throwErrorC,
};

const {
  alt,
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  duplicate,
  extend,
  filter,
  filterMap,
  flatten,
  foldMap,
  map,
  partition,
  partitionMap,
  reduce,
  reduceRight,
  compact,
  separate,
  fromEither,
  filterOrElse,
  fromOption,
  fromPredicate,
} = pipeable(OneShot);

export {
  /**
   * @since 3.3.0
   */
  alt,
  /**
   * @since 3.3.0
   */
  ap,
  /**
   * @since 3.3.0
   */
  apFirst,
  /**
   * @since 3.3.0
   */
  apSecond,
  /**
   * @since 3.3.0
   */
  chain,
  /**
   * @since 3.3.0
   */
  chainFirst,
  /**
   * @since 3.3.0
   */
  duplicate,
  /**
   * @since 3.3.0
   */
  extend,
  /**
   * @since 3.3.0
   */
  filter,
  /**
   * @since 3.3.0
   */
  filterMap,
  /**
   * @since 3.3.0
   */
  flatten,
  /**
   * @since 3.3.0
   */
  foldMap,
  /**
   * @since 3.3.0
   */
  map,
  /**
   * @since 3.3.0
   */
  partition,
  /**
   * @since 3.3.0
   */
  partitionMap,
  /**
   * @since 3.3.0
   */
  reduce,
  /**
   * @since 3.3.0
   */
  reduceRight,
  /**
   * @since 3.3.0
   */
  compact,
  /**
   * @since 3.3.0
   */
  separate,
  /**
   * @since 3.3.0
   */
  fromEither,
  /**
   * @since 3.3.0
   */
  filterOrElse,
  /**
   * @since 3.3.0
   */
  fromOption,
  /**
   * @since 3.3.0
   */
  fromPredicate,
};
