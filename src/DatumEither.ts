/**
 * @file Represents a value of one of six possible types (a disjoint union).
 *
 * An instance of `DatumEither` is equivalent to `Datum<Either<E, A>>`
 *
 * A common use of `DatumEither` is as a container for dealing with refreshable data values that
 * can have error conditions. The full type list is:
 *
 * `Initial`
 * `Pending`
 * `Refresh<Either<E, A>>`
 *   `Refresh<Left<E>>`
 *   `Refresh<Right<A>>`
 * `Replete<Either<E, A>>`
 *   `Replete<Left<E>>`
 *   `Replete<Right<A>>`
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
} from 'fp-ts/es6/Either';
import { EitherM1, getEitherM } from 'fp-ts/es6/EitherT';
import { Monad2 } from 'fp-ts/es6/Monad';
import { pipeable } from 'fp-ts/es6/pipeable';

import {
  datum,
  Datum,
  fold,
  URI as DatumURI,
  refresh,
  replete,
  isReplete,
  Replete,
  constPending,
} from './Datum';
import { Option } from 'fp-ts/es6/Option';
import { Lazy } from 'fp-ts/es6/function';

/**
 * A Monad instance for `Datum<Either<E, A>>`
 *
 * @since 2.0.0
 */
declare module 'fp-ts/es6/HKT' {
  interface URItoKind2<E, A> {
    '@nll/datum/datum-either': Datum<Either<E, A>>;
  }
}

/**
 * @since 2.0.0
 */
export const URI = '@nll/datum/datum-either';

/**
 * @since 2.0.0
 */
export type URI = typeof URI;

/**
 * @since 2.1.0
 */
export type DatumEither<E, A> = Datum<Either<E, A>>;

/**
 * @since 2.0.0
 */
export const datumEither: Monad2<URI> & EitherM1<DatumURI> = {
  ...getEitherM(datum),
  URI,
};

/**
 * @since 2.1.0
 */
export const success = <A>(a: A) => replete(right(a));

/**
 * @since 2.1.0
 */
export const failure = <E>(e: E) => replete(left(e));

/**
 * @since 2.1.0
 */
export const isSuccess = <E, A>(
  fea: DatumEither<E, A>
): fea is Replete<Right<A>> => isReplete(fea) && isRight(fea.value);

/**
 * @since 2.1.0
 */
export const isFailure = <E, A>(
  fea: DatumEither<E, A>
): fea is Replete<Left<E>> => isReplete(fea) && isLeft(fea.value);

/**
 * @since 2.1.0
 */
export const toRefresh = <E, A>(fea: DatumEither<E, A>): DatumEither<E, A> =>
  fold<Either<E, A>, DatumEither<E, A>>(
    constPending,
    constPending,
    () => fea,
    a => refresh(a)
  )(fea);

/**
 * @since 2.2.0
 */
export const fromEither = <E, A>(e: Either<E, A>): DatumEither<E, A> =>
  replete(e);

/**
 * @since 2.2.0
 */
export const fromOption = <E, A>(onNone: Lazy<E>) => (
  o: Option<A>
): DatumEither<unknown, A> => replete(eitherFromOption(onNone)(o));

/**
 * @since 2.1.0
 */
export const refreshFold = <E, A, B>(
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: DatumEither<E, A>): B =>
  fold<Either<E, A>, B>(
    onInitial,
    onPending,
    e => (isRight(e) ? onSuccess(e.right, true) : onFailure(e.left, true)),
    e => (isRight(e) ? onSuccess(e.right, false) : onFailure(e.left, false))
  )(fea);

/**
 * @since 2.1.0
 */
export const refreshFoldR = <E, A, B>(
  fea: DatumEither<E, A>,
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
): B => refreshFold(onInitial, onPending, onFailure, onSuccess)(fea);

const {
  alt,
  ap,
  apFirst,
  apSecond,
  bimap,
  chain,
  chainFirst,
  flatten,
  map,
  mapLeft,
} = pipeable(datumEither);

export {
  /**
   * @since 2.0.0
   */
  alt,
  /**
   * @since 2.0.0
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
};
