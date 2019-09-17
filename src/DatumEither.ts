/**
 * @file Represents a value of one of six possible types (a disjoint union).
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
} from 'fp-ts/lib/Either';
import { EitherM1, getEitherM } from 'fp-ts/lib/EitherT';
import { Monad2 } from 'fp-ts/lib/Monad';
import { pipeable } from 'fp-ts/lib/pipeable';

import {
  datum,
  Datum,
  fold as datumFold,
  URI as DatumURI,
  initial as initialD,
  pending as pendingD,
  refresh,
  replete,
  isValued,
  Replete,
  Refresh,
  isInitial,
  isPending,
  isRefresh,
  isReplete,
} from './Datum';
import { Option } from 'fp-ts/lib/Option';
import { Lazy, constant, FunctionN } from 'fp-ts/lib/function';

/**
 * A Monad instance for `Datum<Either<E, A>>`
 *
 * @since 2.0.0
 */
declare module 'fp-ts/lib/HKT' {
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
 * @since 2.3.0
 */
export type Success<A> = Replete<Right<A>> | Refresh<Right<A>>;

/**
 * @since 2.3.0
 */
export type Failure<E> = Replete<Left<E>> | Refresh<Left<E>>;

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
 * @since 2.4.1
 */
export const initial: DatumEither<never, never> = initialD;

/**
 * @since 2.4.1
 */
export const pending: DatumEither<never, never> = pendingD;

/**
 * @since 2.4.1
 */
export const constInitial = <E, D>(): DatumEither<E, D> => initial;

/**
 * @since 2.4.1
 */
export const constPending = <E, D>(): DatumEither<E, D> => pending;

export {
  /**
   * @since 2.7.0
   */
  isInitial,
  /**
   * @since 2.7.0
   */
  isPending,
  /**
   * @since 2.7.0
   */
  isRefresh,
  /**
   * @since 2.7.0
   */
  isReplete,
  /**
   * @since 2.7.0
   */
  isValued,
};

/**
 * @since 2.7.0
 */
export const isRefreshLeft = <E, A>(
  fea: DatumEither<E, A>
): fea is Refresh<Left<E>> => isRefresh(fea) && isLeft(fea.value);

/**
 * @since 2.7.0
 */
export const isRefreshRight = <E, A>(
  fea: DatumEither<E, A>
): fea is Refresh<Right<A>> => isRefresh(fea) && isRight(fea.value);

/**
 * @since 2.7.0
 */
export const isRepleteLeft = <E, A>(
  fea: DatumEither<E, A>
): fea is Replete<Left<E>> => isReplete(fea) && isLeft(fea.value);

/**
 * @since 2.7.0
 */
export const isRepleteRight = <E, A>(
  fea: DatumEither<E, A>
): fea is Replete<Right<A>> => isReplete(fea) && isRight(fea.value);

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
  datumFold<Either<E, A>, DatumEither<E, A>>(
    constPending,
    constPending,
    constant(fea),
    refresh
  )(fea);

/**
 * @since 2.7.0
 */
export const toReplete = <E, A>(fea: DatumEither<E, A>): DatumEither<E, A> =>
  datumFold<Either<E, A>, DatumEither<E, A>>(
    constInitial,
    constInitial,
    replete,
    constant(fea)
  )(fea);

/**
 * @since 2.2.0
 */
export const fromEither = <E, A>(e: Lazy<Either<E, A>>): DatumEither<E, A> =>
  replete(e());

/**
 * @since 2.2.0
 */
export const fromOption = <E, A>(onNone: Lazy<E>) => (
  o: Option<A>
): DatumEither<unknown, A> => replete(eitherFromOption(onNone)(o));

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
) => (fea: DatumEither<E, A>): B => {
  switch (fea._tag) {
    case 'Initial':
      return onInitial();
    case 'Pending':
      return onPending();
    case 'Refresh':
      return eitherFold(onRefreshLeft, onRefreshRight)(fea.value);
    case 'Replete':
      return eitherFold(onRepleteLeft, onRepleteRight)(fea.value);
  }
};

/**
 * @since 2.1.0
 */
export const refreshFold = <E, A, B>(
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: DatumEither<E, A>): B =>
  datumFold<Either<E, A>, B>(
    onInitial,
    onPending,
    e => (isRight(e) ? onSuccess(e.right, true) : onFailure(e.left, true)),
    e => (isRight(e) ? onSuccess(e.right, false) : onFailure(e.left, false))
  )(fea);

/**
 * @since 2.3.0
 */
export const squash = <E, A, B>(
  onNone: (r?: boolean) => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: DatumEither<E, A>) =>
  datumFold<Either<E, A>, B>(
    () => onNone(false),
    () => onNone(true),
    e => (isRight(e) ? onSuccess(e.right, true) : onFailure(e.left, true)),
    e => (isRight(e) ? onSuccess(e.right, false) : onFailure(e.left, false))
  )(fea);

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
