/**
 * @since 2.0.0
 *
 * Represents a value of one of six possible types (a disjoint union).
 *
 * An instance of `DatumEither` is equivalent to `Datum<Either<E, A>>`
 *
 * A common use of `DatumEither` is as a container for dealing with refreshable data values that
 * can have error conditions. The full type list is:
 *
 * - `Initial`
 * - `Pending`
 * - `Refresh<Either<E, A>>`
 *   - `Refresh<Left<E>>`
 *   - `Refresh<Right<A>>`
 * - `Replete<Either<E, A>>`
 *   - `Replete<Left<E>>`
 *   - `Replete<Right<A>>`
 *
 * There are additional helper methods for going from refresh to replete and back.
 */

import {
  Either,
  left,
  isRight,
  Right,
  isLeft,
  Left,
  right,
  fromOption as eitherFromOption,
  fold as eitherFold,
} from 'fp-ts/es6/Either';
import { EitherM1, getEitherM } from 'fp-ts/es6/EitherT';
import { Monad2 } from 'fp-ts/es6/Monad';
import { pipe, pipeable } from 'fp-ts/es6/pipeable';

import * as D from './Datum';
import { Option } from 'fp-ts/es6/Option';
import { Lazy, constant, FunctionN, flow } from 'fp-ts/es6/function';
import { Apply2, sequenceS, sequenceT } from 'fp-ts/es6/Apply';
import { Applicative as ApplicativeHKT, Applicative2 } from 'fp-ts/es6/Applicative';
import { HKT } from 'fp-ts/es6/HKT';
import { Traversable2 } from 'fp-ts/es6/Traversable';
import { Monoid } from 'fp-ts/es6/Monoid';
import { Functor2 } from 'fp-ts/es6/Functor';
import { Chain2 } from 'fp-ts/es6/Chain';
import { Alt2 } from 'fp-ts/es6/Alt';
import { Alternative2 } from 'fp-ts/es6/Alternative';
import { MonadThrow2 } from 'fp-ts/es6/MonadThrow';
import { Foldable2 } from 'fp-ts/es6/Foldable';
import { Bifunctor2 } from 'fp-ts/es6/Bifunctor';


/**
 * A Monad instance for `Datum<Either<E, A>>`
 *
 * @since 2.0.0
 */
declare module 'fp-ts/es6/HKT' {
  interface URItoKind2<E, A> {
    '@nll/datum/DatumEither': D.Datum<Either<E, A>>;
  }
}

/**
 * @since 2.0.0
 */
export const URI = '@nll/datum/DatumEither';

/**
 * @since 2.0.0
 */
export type URI = typeof URI;

/**
 * @since 2.1.0
 */
export type DatumEither<E, A> = D.Datum<Either<E, A>>;

/**
 * @since 3.4.0
 */
export type Valued<A> = D.Refresh<A> | D.Replete<A>;

/**
 * @since 2.3.0
 */
export type Success<A> = Valued<Right<A>>;

/**
 * @since 2.3.0
 */
export type Failure<E> = Valued<Left<E>>;

/**
 * @since 3.2.0
 */
export type ToLeft<T> = T extends DatumEither<infer L, infer _> ? L : never;

/**
 * @since 3.2.0
 */
export type ToRight<T> = T extends DatumEither<infer _, infer R> ? R : never;

/**
 * @since 2.4.1
 */
export const initial: DatumEither<never, never> = D.initial;

/**
 * @since 2.4.1
 */
export const pending: DatumEither<never, never> = D.pending;

/**
 * @since 2.1.0
 */
export const success = <E = never, A = never>(a: A): DatumEither<E, A> =>
  D.replete(right(a));

/**
 * @since 2.1.0
 */
export const failure = <E = never, A = never>(e: E): DatumEither<E, A> =>
  D.replete(left(e));

/**
 * @since 3.4.0
 */
export const successR = <E = never, A = never>(a: A): DatumEither<E, A> =>
  toRefresh(D.replete(right(a)));

/**
 * @since 3.4.0
 */
export const failureR = <E = never, A = never>(e: E): DatumEither<E, A> =>
  toRefresh(D.replete(left(e)));

/**
 * @since 2.4.1
 */
export function constInitial<E = never, D = never>(): DatumEither<E, D> {
  return initial;
}

/**
 * @since 2.4.1
 */
export const constPending = <E = never, D = never>(): DatumEither<E, D> =>
  pending;

/**
 * @since 2.7.0
 */
export const isInitial = D.isInitial;

/**
 * @since 2.7.0
 */
export const isPending = D.isPending;

/**
 * @since 2.7.0
 */
export const isRefresh = D.isRefresh;

/**
 * @since 2.7.0
 */
export const isReplete = D.isReplete;

/**
 * @since 2.7.0
 */
export const isValued = D.isValued;

/**
 * @since 2.7.0
 */
export const isRefreshLeft = <E, A>(
  fea: DatumEither<E, A>
): fea is D.Refresh<Left<E>> => isRefresh(fea) && isLeft(fea.value);

/**
 * @since 2.7.0
 */
export const isRefreshRight = <E, A>(
  fea: DatumEither<E, A>
): fea is D.Refresh<Right<A>> => isRefresh(fea) && isRight(fea.value);

/**
 * @since 2.7.0
 */
export const isRepleteLeft = <E, A>(
  fea: DatumEither<E, A>
): fea is D.Replete<Left<E>> => isReplete(fea) && isLeft(fea.value);

/**
 * @since 2.7.0
 */
export const isRepleteRight = <E, A>(
  fea: DatumEither<E, A>
): fea is D.Replete<Right<A>> => isReplete(fea) && isRight(fea.value);

/**
 * @since 2.1.0
 */
export const isSuccess = <E, A>(fea: DatumEither<E, A>): fea is Success<A> =>
  isValued(fea) && isRight(fea.value);

/**
 * @since 2.1.0
 */
export const isFailure = <E, A>(fea: DatumEither<E, A>): fea is Failure<E> =>
  isValued(fea) && isLeft(fea.value);

/**
 * @since 2.1.0
 */
export const toRefresh = <E, A>(fea: DatumEither<E, A>): DatumEither<E, A> =>
  D.fold<Either<E, A>, DatumEither<E, A>>(
    constPending,
    constPending,
    constant(fea),
    D.refresh
  )(fea);

/**
 * @since 2.7.0
 */
export const toReplete = <E, A>(fea: DatumEither<E, A>): DatumEither<E, A> =>
  D.fold<Either<E, A>, DatumEither<E, A>>(
    constInitial,
    constInitial,
    D.replete,
    constant(fea)
  )(fea);

/**
 * fromEither will remove the Lazy input in the next major release
 *
 * @since 2.2.0
 *
 * @deprecated
 */
export const fromEither = <E, A>(e: Lazy<Either<E, A>>): DatumEither<E, A> =>
  D.replete(e());

/**
 * fromEither2 will replace fromEither in the next major release
 *
 * @since 3.4.0
 *
 * @deprecated
 */
export const fromEither2 = <E, A>(e: Either<E, A>): DatumEither<E, A> =>
  D.replete(e);

/**
 * @since 2.2.0
 */
export const fromOption = <E, A>(onNone: Lazy<E>) => (
  o: Option<A>
): DatumEither<E, A> => D.replete(eitherFromOption(onNone)(o));

/**
 * Takes a nullable value, if the value is not nully, turn it into a `Success<A>`, otherwise `Initial`.
 *
 * @since 2.4.0
 */
export const fromNullable = <E, A>(
  a: A | null | undefined
): DatumEither<E, A> => (a === null || a === undefined ? initial : success(a));

/**
 * @since 2.7.0
 */
export const fold = <E, A, B>(
  onInitial: Lazy<B>,
  onPending: Lazy<B>,
  onRefreshLeft: FunctionN<[E], B>,
  onRefreshRight: FunctionN<[A], B>,
  onRepleteLeft: FunctionN<[E], B>,
  onRepleteRight: FunctionN<[A], B>
) => (fea: DatumEither<E, A>): B =>
  pipe(
    fea,
    D.fold(
      onInitial,
      onPending,
      eitherFold(onRefreshLeft, onRefreshRight),
      eitherFold(onRepleteLeft, onRepleteRight)
    )
  );

/**
 * @since 2.1.0
 */
export const refreshFold = <E, A, B>(
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: DatumEither<E, A>): B =>
  D.fold<Either<E, A>, B>(
    onInitial,
    onPending,
    (e) => (isRight(e) ? onSuccess(e.right, true) : onFailure(e.left, true)),
    (e) => (isRight(e) ? onSuccess(e.right, false) : onFailure(e.left, false))
  )(fea);

/**
 * @since 2.3.0
 */
export const squash = <E, A, B>(
  onNone: (r?: boolean) => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: DatumEither<E, A>) =>
  D.fold<Either<E, A>, B>(
    () => onNone(false),
    () => onNone(true),
    (e) => (isRight(e) ? onSuccess(e.right, true) : onFailure(e.left, true)),
    (e) => (isRight(e) ? onSuccess(e.right, false) : onFailure(e.left, false))
  )(fea);

/**
 * @since 3.4.0
 */
const traverseC = <F>(F: ApplicativeHKT<F>) => <E, A, B>(
  ta: DatumEither<E, A>,
  f: (a: A) => HKT<F, B>
): HKT<F, DatumEither<E, B>> =>
  fold<E, A, HKT<F, DatumEither<E, B>>>(
    () => F.of(initial),
    () => F.of(pending),
    (e) => F.of(D.refresh(left(e))),
    (a) => F.map(f(a), flow(right, D.refresh)),
    (e) => F.of(D.replete(left(e))),
    (a) => F.map(f(a), flow(right, D.replete))
  )(ta);

/**
 * @since 3.4.0
 */
const sequenceC = <F>(F: ApplicativeHKT<F>) => <E, A>(
  ta: DatumEither<E, HKT<F, A>>
): HKT<F, DatumEither<E, A>> =>
  fold<E, HKT<F, A>, HKT<F, DatumEither<E, A>>>(
    () => F.of(initial),
    () => F.of(pending),
    (e) => F.of(D.refresh(left(e))),
    (a) => F.map(a, flow(right, D.refresh)),
    (e) => F.of(D.replete(left(e))),
    (a) => F.map(a, flow(right, D.replete))
  )(ta);

/**
 * @since 3.4.0
 */
const reduceC = <E, A, B>(
  fa: DatumEither<E, A>,
  b: B,
  f: (b: B, a: A) => B
): B =>
  pipe(
    fa,
    fold(
      () => b,
      () => b,
      () => b,
      (a) => f(b, a),
      () => b,
      (a) => f(b, a)
    )
  );

/**
 * @since 3.4.0
 */
const foldMapC = <M>(M: Monoid<M>) => <E, A>(
  fa: DatumEither<E, A>,
  f: (a: A) => M
): M =>
  fold<E, A, M>(
    () => M.empty,
    () => M.empty,
    () => M.empty,
    f,
    () => M.empty,
    f
  )(fa);

/**
 * @since 3.4.0
 */
const reduceRightC = <E, A, B>(
  fa: DatumEither<E, A>,
  b: B,
  f: (a: A, b: B) => B
): B =>
  fold<E, A, B>(
    () => b,
    () => b,
    () => b,
    (a) => f(a, b),
    () => b,
    (a) => f(a, b)
  )(fa);

/**
 * @since 2.0.0
 * 
 * @deprecated Use standalone instances and instance factories
 */
export const datumEither: Monad2<URI> & Traversable2<URI> & EitherM1<D.URI> = {
  URI,
  ...getEitherM(D.datum),
  traverse: traverseC,
  sequence: sequenceC,
  reduce: reduceC,
  foldMap: foldMapC,
  reduceRight: reduceRightC,
};

// TODO: After we bump the min bound to >= 2.10, replace this with individual helper fns
const eitherTDatum = getEitherM(D.Monad)

/**
 * @since 3.5.0
 */
export const Functor: Functor2<URI> = {
  URI,
  map: eitherTDatum.map
}


/**
 * @since 3.5.0
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  mapLeft: eitherTDatum.mapLeft,
  bimap: eitherTDatum.bimap
}

/**
 * @since 3.5.0
 * 
 * Note: This instance agrees with the standalone Applicative/Chain/Monad instances but _disagrees_ with the deprecated `datum` mega-instance.
 */
export const Apply: Apply2<URI> = {
  ...Functor,
  ap: eitherTDatum.ap
}

/**
 * @since 3.5.0
 */
export const Chain: Chain2<URI> = {
  ...Apply,
  chain: eitherTDatum.chain
}

/**
 * @since 3.5.0
 */
export const Applicative: Applicative2<URI> = {
  ...Apply,
  of: eitherTDatum.of
}

/**
 * @since 3.5.0
 */
export const Alt: Alt2<URI> = {
  ...Functor,
  alt: eitherTDatum.alt
}

/**
 * @since 3.5.0
 */
export const Alternative: Alternative2<URI> = {
  ...Alt,
  ...Applicative,
  zero: constInitial
}

/**
 * @since 3.5.0
 */
export const Monad: Monad2<URI> = {
  ...Chain,
  of: eitherTDatum.of
}

/**
 * @since 3.5.0
 */
export const MonadThrow: MonadThrow2<URI> = {
  ...Monad,
  throwError: failure
}

/**
 * @since 3.5.0
 */
export const Foldable: Foldable2<URI> = {
  URI,
  reduce: reduceC,
  reduceRight: reduceRightC,
  foldMap: foldMapC
}

/**
 * @since 3.5.0
 */
export const Traversable: Traversable2<URI> = {
  ...Functor,
  ...Foldable,
  sequence: sequenceC,
  traverse: traverseC
}

/**
 * @since 3.2.0
 */
export const sequenceTuple = sequenceT(Apply);

/**
 * @since 3.2.0
 */
export const sequenceStruct = sequenceS(Apply);

/**
 * @since 3.2.0
 */
const {
  alt,
  ap,
  apFirst,
  apSecond,
  bimap,
  chain,
  chainFirst,
  flatten,
  foldMap,
  map,
  mapLeft,
  reduce,
  reduceRight,
} = pipeable(datumEither);

const {
  ap: ap2
} = pipeable(Apply);

export {
  /**
   * @since 2.0.0
   */
  alt,
  /**
   * @since 2.0.0
   * 
   * @deprecated Does not agree with chain. This will be replaced in the next major release with the behavior of `ap2`
   */
  ap,
  /**
   * @since 3.5.0
   * 
   */
  ap2,
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
  bimap,
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
  flatten,
  /**
   * @since 2.0.0
   */
  map,
  /**
   * @since 2.0.0
   */
  mapLeft,
  /**
   * @since 3.4.0
   */
  reduce,
  /**
   * @since 3.4.0
   */
  foldMap,
  /**
   * @since 3.4.0
   */
  reduceRight,
};
