/**
 * @since 2.0.0
 *
 * Represents a value of one of four possible types (a disjoint union).
 *
 * An instance of `Datum` is either an instance of `Initial`, `Pending`, `Refresh` or `Replete`.
 *
 * A common use of `Datum` is as a container for dealing with refreshable data values. In this usage,
 * the initial value is `Initial`. `Pending` represents in flight activity. `Refresh` indicates
 * that data exists but is being refreshed, and `Replete` meands data exists and is not being
 * refreshed.
 */
import { Alternative1 } from 'fp-ts/es6/Alternative';
import { Applicative as ApplicativeHKT, Applicative1 } from 'fp-ts/es6/Applicative';
import { Apply1 } from 'fp-ts/es6/Apply';
import { Chain1 } from 'fp-ts/es6/Chain';
import { Compactable1, Separated } from 'fp-ts/es6/Compactable';
import { Either, isLeft, isRight } from 'fp-ts/es6/Either';
import { Eq } from 'fp-ts/es6/Eq';
import { Extend1 } from 'fp-ts/es6/Extend';
import { Filterable1 } from 'fp-ts/es6/Filterable';
import { Foldable1 } from 'fp-ts/es6/Foldable';
import { constFalse, identity, Predicate, constant } from 'fp-ts/es6/function';
import { Functor1 } from 'fp-ts/es6/Functor';
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
import { Alt1 } from 'fp-ts/es6/Alt';

/**
 * @since 1.0.0
 */
declare module 'fp-ts/es6/HKT' {
  interface URItoKind<A> {
    '@nll/datum/Datum': Datum<A>;
  }
}

/**
 * @since 2.0.0
 */
export const URI = '@nll/datum/Datum';

/**
 * @since 2.0.0
 */
export type URI = typeof URI;

/**
 * @since 2.0.0
 */
export interface Initial {
  readonly _tag: 'Initial';
}

/**
 * @since 2.0.0
 */
export interface Pending {
  readonly _tag: 'Pending';
}

/**
 * @since 2.0.0
 */
export interface Refresh<D> {
  readonly _tag: 'Refresh';
  readonly value: D;
}

/**
 * @since 2.0.0
 */
export interface Replete<D> {
  readonly _tag: 'Replete';
  readonly value: D;
}

/**
 * @since 2.0.0
 */
export type Datum<D> = Initial | Pending | Refresh<D> | Replete<D>;

/**
 * Constructs an initial `Datum` holding no value.
 *
 * @since 2.0.0
 */
export const initial: Datum<never> = {
  _tag: 'Initial'
};

/**
 * Constructs a pending `Datum` holding no value.
 *
 * @since 2.0.0
 */
export const pending: Datum<never> = {
  _tag: 'Pending'
};

/**
 * Constructs a new refresh `Datum` holding a value.
 *
 * @since 2.0.0
 */
export const refresh = <A = never>(value: A): Datum<A> => ({
  _tag: 'Refresh',
  value
});

/**
 * Constructs a new replete `Datum` holding a value.
 *
 * @since 2.0.0
 */
export const replete = <A = never>(value: A): Datum<A> => ({
  _tag: 'Replete',
  value
});

/**
 * @since 2.0.0
 */
export const constInitial = constant(initial);

/**
 * @since 2.0.0
 */
export const constPending = constant(pending);

/**
 * Takes a nullable value, if the value is not nully, turn it into a `Replete`, otherwise `Initial`.
 *
 * @since 2.0.0
 */
export const fromNullable = <A>(a: A | null | undefined): Datum<A> =>
  a === null || a === undefined ? initial : replete(a);

/**
 * @since 2.0.0
 */
export const fold = <A, B>(
  onInitial: () => B,
  onPending: () => B,
  onRefresh: (v: A) => B,
  onReplete: (a: A) => B
) => (ma: Datum<A>): B => {
  switch (ma._tag) {
    case 'Initial':
      return onInitial();
    case 'Pending':
      return onPending();
    case 'Refresh':
      return onRefresh(ma.value);
    case 'Replete':
      return onReplete(ma.value);
  }
};

/**
 * @since 2.0.0
 */
export const getShow = <A>(S: Show<A>): Show<Datum<A>> => ({
  show: fold(
    constant('initial'),
    constant('pending'),
    v => `refresh(${S.show(v)})`,
    v => `replete(${S.show(v)})`
  )
});

/**
 * @since 2.0.0
 */
export const getEq = <A>(E: Eq<A>): Eq<Datum<A>> => ({
  equals: (x, y) =>
    x === y ||
    (isReplete(x) && isReplete(y) && E.equals(x.value, y.value)) ||
    (isRefresh(x) && isRefresh(y) && E.equals(x.value, y.value)) ||
    (isInitial(x) && isInitial(y)) ||
    (isPending(x) && isPending(y))
});

/**
 * Viewing Datum as the following progess of state changes:
 * 
 * Initial -> Pending -> Replete -> Refresh [-> Replete -> ...]
 * 
 * This semigroup has a bias towards datums with values and a bias towards Pending/Refresh. 
 * Notably, concat(Pending, Replete) gives Refresh.
 * If both datums have a value, they're combined with the given Semigroup instance.
 *
 * @since 4.0.0
 */
export const getSemigroup = <A>(S: Semigroup<A>): Semigroup<Datum<A>> => ({
  concat: (firstD: Datum<A>, secondD: Datum<A>) => 
    fold<A, Datum<A>>(
      constant(secondD), // Empty value
      () => fold<A, Datum<A>>(
        constant(firstD),
        constant(secondD),
        constant(secondD),
        refresh
      )(secondD),
      first => fold<A, Datum<A>>(
        constant(firstD),
        constant(firstD),
        second => refresh(S.concat(first, second)),
        second => refresh(S.concat(first, second))
      )(secondD),
      first => fold<A, Datum<A>>(
        constant(firstD),
        constant(refresh(first)),
        second => refresh(S.concat(first, second)),
        second => replete(S.concat(first, second))
      )(secondD)
    )(firstD)
});

/**
 * See getSemigroup. Empty value of initial.
 * 
 * @since 4.0.0
 */
 export const getMonoid = <A>(S: Semigroup<A>): Monoid<Datum<A>> => ({
  ...getSemigroup(S),
  empty: initial
})

const constZero = constant<0>(0);
const constNegOne = constant<-1>(-1);
const constOne = constant<1>(1);

/**
 * The `Ord` instance allows `Datum` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Datum` contains.
 *
 * `Initial` < `Pending` < `Refresh` | `Replete`
 *
 * @since 2.0.0
 */
export function getOrd<A>(O: Ord<A>): Ord<Datum<A>> {
  return {
    equals: getEq(O).equals,
    compare: (xa, ya): Ordering =>
      fold<A, Ordering>(
        // x Initial
        constant(
          fold<A, Ordering>(
            constZero,
            constNegOne,
            constNegOne,
            constNegOne
          )(ya)
        ),
        // x Pending
        constant(
          fold<A, Ordering>(constOne, constZero, constNegOne, constNegOne)(ya)
        ),
        // x Refresh
        x =>
          fold<A, Ordering>(
            constOne,
            constOne,
            y => O.compare(x, y),
            constNegOne
          )(ya),
        // x Replete
        x =>
          fold<A, Ordering>(constOne, constOne, constOne, y => O.compare(x, y))(
            ya
          )
      )(xa)
  };
}

/**
 * `Apply` semigroup
 *
 * @since 4.0.0
 * 
 */
export const getApplySemigroup = <A>(S: Semigroup<A>): Semigroup<Datum<A>> => ({
  // TODO: replace with apply.getApplySemigroup if we bump the min supported version of fp-ts >= 2.10
  // Or just remove in place of that factory instance
  concat: (first: Datum<A>, second: Datum<A>) =>
    Apply.ap(
      Apply.map(first, (x: A) => (y: A) => S.concat(x, y)),
      second
    )
})

/**
 * Returns `true` if the Async is an instance of `Initial`, `false` otherwise
 *
 * @since 2.0.0
 */
export const isInitial = <A>(ma: Datum<A>): ma is Initial =>
  ma._tag === 'Initial';

/**
 * Returns `true` if the Async is an instance of `Pending`, `false` otherwise
 *
 * @since 2.0.0
 */
export const isPending = <A>(ma: Datum<A>): ma is Pending =>
  ma._tag === 'Pending';

/**
 * Returns `true` if the Async is an instance of `Refresh`, `false` otherwise
 *
 * @since 2.0.0
 */
export const isRefresh = <A>(ma: Datum<A>): ma is Refresh<A> =>
  ma._tag === 'Refresh';

/**
 * Returns `true` if the Async is an instance of `Replete`, `false` otherwise
 *
 * @since 2.0.0
 */
export const isReplete = <A>(ma: Datum<A>): ma is Replete<A> =>
  ma._tag === 'Replete';

/**
 * @since 2.0.0
 */
export const isValued = <A>(ma: Datum<A>): ma is Replete<A> | Refresh<A> =>
  isReplete(ma) || isRefresh(ma);

/**
 * @since 2.0.0
 */
export const getOrElse = <A>(onInitial: () => A, onPending: () => A) => (
  ma: Datum<A>
): A => fold<A, A>(onInitial, onPending, identity, identity)(ma);

/**
 * @since 2.0.0
 */
export const elem = <A>(E: Eq<A>) => <E>(a: A, ma: Datum<A>): boolean =>
  fold<A, boolean>(
    constFalse,
    constFalse,
    b => E.equals(a, b),
    b => E.equals(a, b)
  )(ma);

/**
 * Returns `false` if `Refresh` or returns the result of the application of the given predicate to the `Replete` value.
 *
 * @since 2.0.0
 */
export const exists = <A>(predicate: Predicate<A>) => <E>(
  ma: Datum<A>
): boolean =>
  fold<A, boolean>(constFalse, constFalse, predicate, predicate)(ma);

/**
 * @since 2.0.0
 */
const mapC = <A, B>(fa: Datum<A>, f: (a: A) => B): Datum<B> =>
  fold<A, Datum<B>>(
    constInitial,
    constPending,
    a => refresh(f(a)),
    a => replete(f(a))
  )(fa);

  /**
   * @since 3.5.0
   */
const apC = <A, B>(fab: Datum<(a: A) => B>, fa: Datum<A>): Datum<B> => chainC(fab, f => mapC(fa, f))

/**
 * @since 2.0.0
 */
const chainC = <A, B>(fa: Datum<A>, f: (a: A) => Datum<B>): Datum<B> =>
  fold<A, Datum<B>>(constInitial, constPending, f, f)(fa);

/**
 * @since 2.0.0
 */
const reduceC = <A, B>(fa: Datum<A>, b: B, f: (b: B, a: A) => B): B =>
  fold<A, B>(
    () => b,
    () => b,
    a => f(b, a),
    a => f(b, a)
  )(fa);

/**
 * @since 2.0.0
 */
const foldMapC = <M>(M: Monoid<M>) => <A>(fa: Datum<A>, f: (a: A) => M): M =>
  fold<A, M>(
    () => M.empty,
    () => M.empty,
    f,
    f
  )(fa);

/**
 * @since 2.0.0
 */
const reduceRightC = <A, B>(fa: Datum<A>, b: B, f: (a: A, b: B) => B): B =>
  fold<A, B>(
    () => b,
    () => b,
    a => f(a, b),
    a => f(a, b)
  )(fa);

/**
 * @since 2.0.0
 */
const traverseC = <F>(F: ApplicativeHKT<F>) => <A, B>(
  ta: Datum<A>,
  f: (a: A) => HKT<F, B>
): HKT<F, Datum<B>> =>
  fold<A, HKT<F, Datum<B>>>(
    () => F.of(initial),
    () => F.of(pending),
    a => F.map(f(a), refresh),
    a => F.map(f(a), replete)
  )(ta);

/**
 * @since 2.0.0
 */
const sequenceC = <F>(F: ApplicativeHKT<F>) => <A>(
  ta: Datum<HKT<F, A>>
): HKT<F, Datum<A>> =>
  fold<HKT<F, A>, HKT<F, Datum<A>>>(
    () => F.of(initial),
    () => F.of(pending),
    a => F.map(a, refresh),
    a => F.map(a, replete)
  )(ta);

/**
 * @since 2.0.0
 */
const altC = <A>(fx: Datum<A>, fy: () => Datum<A>): Datum<A> =>
  fold<A, Datum<A>>(fy, fy, refresh, replete)(fx);

/**
 * @since 2.0.0
 */
const extendC = <A, B>(wa: Datum<A>, f: (wa: Datum<A>) => B): Datum<B> =>
  replete(f(wa));

/**
 * @since 2.0.0
 */
const compactC = <A>(fa: Datum<Option<A>>): Datum<A> =>
  fold<Option<A>, Datum<A>>(
    constInitial,
    constPending,
    a => (isSome(a) ? refresh(a.value) : initial),
    a => (isSome(a) ? replete(a.value) : initial)
  )(fa);

const defaultSeparate = {
  left: initial as Datum<any>,
  right: initial as Datum<any>
};

/**
 * @since 2.0.0
 */
const separateC = <A, B>(
  fa: Datum<Either<A, B>>
): Separated<Datum<A>, Datum<B>> => {
  const s = mapC(fa, e => ({
    left: isLeft(e) ? replete(e.left) : initial,
    right: isRight(e) ? replete(e.right) : initial
  }));

  return getOrElse(
    () => defaultSeparate,
    () => defaultSeparate
  )(s);
};

/**
 * @since 2.0.0
 */
const filterC = <A>(fa: Datum<A>, predicate: Predicate<A>): Datum<A> =>
  fold<A, Datum<A>>(
    constInitial,
    constPending,
    a => (predicate(a) ? fa : initial),
    a => (predicate(a) ? fa : initial)
  )(fa);

/**
 * @since 2.0.0
 */
const filterMapC = <A, B>(ma: Datum<A>, f: (a: A) => Option<B>): Datum<B> =>
  compactC(mapC(ma, f));

/**
 * @since 2.0.0
 */
const partitionC = <A>(
  fa: Datum<A>,
  predicate: Predicate<A>
): Separated<Datum<A>, Datum<A>> => ({
  left: filterC(fa, a => !predicate(a)),
  right: filterC(fa, predicate)
});

/**
 * @since 2.0.0
 */
const partitionMapC = <A, B, C>(fa: Datum<A>, f: (a: A) => Either<B, C>) =>
  separateC(mapC(fa, f));

/**
 * @since 2.0.0
 */
const witherC = <F>(F: ApplicativeHKT<F>) => <A, B>(
  fa: Datum<A>,
  f: (a: A) => HKT<F, Option<B>>
): HKT<F, Datum<B>> =>
  fold<A, HKT<F, Datum<B>>>(
    constant(F.of(initial)),
    constant(F.of(pending)),
    a => F.map(f(a), o => (isSome(o) ? refresh(o.value) : initial)),
    a => F.map(f(a), o => (isSome(o) ? replete(o.value) : initial))
  )(fa);

/**
 * @since 2.0.0
 */
const wiltC = <F>(F: ApplicativeHKT<F>) => <A, B, C>(
  fa: Datum<A>,
  f: (a: A) => HKT<F, Either<B, C>>
): HKT<F, Separated<Datum<B>, Datum<C>>> => {
  const s = mapC(fa, a =>
    F.map(f(a), e => ({
      left: isLeft(e) ? replete(e.left) : initial,
      right: isRight(e) ? replete(e.right) : initial
    }))
  );
  return isValued(s) ? s.value : F.of(defaultSeparate);
};

/**
 * @since 2.0.0
 */
const throwErrorC = <E, A>(e: E): Datum<A> => initial;


/**
 * @since 3.5.0
 */
export const Functor: Functor1<URI> = {
  URI,
  map: mapC
}

/**
 * @since 3.5.0
 * 
 * Note: This instance agrees with the standalone Applicative/Chain/Monad instances but _disagrees_ with the deprecated `datum` mega-instance.
 */
export const Apply: Apply1<URI> = {
  ...Functor,
  ap: apC
}

/**
 * @since 3.5.0
 */
export const Chain: Chain1<URI> = {
  ...Apply,
  chain: chainC
}

/**
 * @since 3.5.0
 */
export const Applicative: Applicative1<URI> = {
  ...Apply,
  of: replete
}

/**
 * @since 3.5.0
 */
export const Alt: Alt1<URI> = {
  ...Functor,
  alt: altC
}

/**
 * @since 3.5.0
 */
export const Alternative: Alternative1<URI> = {
  ...Alt,
  ...Applicative,
  zero: constInitial
}

/**
 * @since 3.5.0
 */
export const Monad: Monad1<URI> = {
  ...Chain,
  of: replete
}

/**
 * @since 3.5.0
 */
export const MonadThrow: MonadThrow1<URI> = {
  ...Monad,
  throwError: throwErrorC
}

/**
 * @since 3.5.0
 */
export const Foldable: Foldable1<URI> = {
  URI,
  reduce: reduceC,
  reduceRight: reduceRightC,
  foldMap: foldMapC
}

/**
 * @since 3.5.0
 */
export const Traversable: Traversable1<URI> = {
  ...Functor,
  ...Foldable,
  sequence: sequenceC,
  traverse: traverseC
}

/**
 * @since 3.5.0
 */
export const Extend: Extend1<URI> = {
  ...Functor,
  extend: extendC
}

/**
 * @since 3.5.0
 */
export const Compactable: Compactable1<URI> = {
  URI,
  compact: compactC,
  separate: separateC
}

/**
 * @since 3.5.0
 */
export const Filterable: Filterable1<URI> = {
  ...Functor,
  ...Compactable,
  partition: partitionC,
  partitionMap: partitionMapC,
  filter: filterC,
  filterMap: filterMapC
}

/**
 * @since 3.5.0
 */
export const Witherable: Witherable1<URI> = {
  ...Traversable,
  ...Filterable,
  wilt: wiltC,
  wither: witherC
}

const {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  flatten,
  map,
  fromEither,
  filterOrElse,
  fromOption,
  fromPredicate
} = pipeable(MonadThrow);

const {
  alt,
} = pipeable(Alt)

const {
  foldMap,
  reduce,
  reduceRight,
} = pipeable(Foldable)

const {
  partition,
  partitionMap,
  compact,
  separate,
  filter,
  filterMap,
} = pipeable(Witherable)

const {
  duplicate,
  extend,
} = pipeable(Extend)

export {
  /**
   * @since 2.0.0
   */
  alt,
  /**
   * @since 4.0.0
   */
  ap,
  /**
   * @since 2.0.0
   */
  apFirst,
  /**
   * @since 2.0.0
   */
  apSecond,
  /**
   * @since 2.0.0
   */
  chain,
  /**
   * @since 2.0.0
   */
  chainFirst,
  /**
   * @since 2.0.0
   */
  duplicate,
  /**
   * @since 2.0.0
   */
  extend,
  /**
   * @since 2.0.0
   */
  filter,
  /**
   * @since 2.0.0
   */
  filterMap,
  /**
   * @since 2.0.0
   */
  flatten,
  /**
   * @since 2.0.0
   */
  foldMap,
  /**
   * @since 2.0.0
   */
  map,
  /**
   * @since 2.0.0
   */
  partition,
  /**
   * @since 2.0.0
   */
  partitionMap,
  /**
   * @since 2.0.0
   */
  reduce,
  /**
   * @since 2.0.0
   */
  reduceRight,
  /**
   * @since 2.0.0
   */
  compact,
  /**
   * @since 2.0.0
   */
  separate,
  /**
   * @since 2.0.0
   */
  fromEither,
  /**
   * @since 2.6.0
   */
  filterOrElse,
  /**
   * @since 2.6.0
   */
  fromOption,
  /**
   * @since 2.6.0
   */
  fromPredicate
};
