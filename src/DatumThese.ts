/**
 * @since 2.8.0
 *
 * Represents a value of one of eight possible types (a disjoint union).
 *
 * An instance of `DatumThese` is equivalent to `Datum<These<E, A>>`
 *
 * A common use of `DatumThese` is as a container for dealing with refreshable data values that
 * can have error conditions. The full type list is:
 *
 * - `Initial`
 * - `Pending`
 * - `Refresh<T.These<E, A>>`
 *   - `Refresh<Left<E>>`
 *   - `Refresh<Right<A>>`
 *   - `Refresh<Both<E, A>>`
 * - `Replete<T.These<E, A>>`
 *   - `Replete<Left<E>>`
 *   - `Replete<Right<A>>`
 *   - `Replete<Both<E, A>>`
 *
 * There are additional helper methods for going from refresh to replete and back.
 */

import * as D from './Datum';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/These';
import * as TT from 'fp-ts/lib/TheseT';

import { Monad2 } from 'fp-ts/lib/Monad';
import { pipeable } from 'fp-ts/lib/pipeable';
import { Option } from 'fp-ts/lib/Option';
import { Lazy, constant, FunctionN } from 'fp-ts/lib/function';

/**
 * A Monad instance for `Datum<These<E, A>>`
 *
 * @since 2.8.0
 */
declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    '@nll/datum/datum-these': DatumThese<E, A>;
  }
}

/**
 * @since 2.8.0
 */
export const URI = '@nll/datum/datum-these';

/**
 * @since 2.8.0
 */
export type URI = typeof URI;

/**
 * @since 2.8.0
 */
export type DatumThese<E, A> = D.Datum<T.These<E, A>>;

/**
 * @since 2.8.0
 */
export type HasRight<E, A> = E.Right<A> | T.Both<E, A>;

/**
 * @since 2.8.0
 */
export type HasLeft<E, A> = E.Left<A> | T.Both<E, A>;


/**
 * @since 2.8.0
 */
export type Success<E, A> = D.Valued<HasRight<E, A>>;

/**
 * @since 2.8.0
 */
export type Failure<E, A> = D.Valued<HasLeft<E, A>>;

/**
 * @since 2.8.0
 */
const DT = TT.getTheseM(D.datum);

/**
 * @since 2.4.0
 */
export function getMonad<E>(S: Semigroup<E>): Monad2C<URI, E> & MonadTask2C<URI, E> {
  return {
    URI,
    ...T.getMonad(S),
    fromIO: rightIO,
    fromTask: rightTask
  }
}

/**
 * @since 2.8.0
 */
export const success = <A>(a: A) => DT.(right(a));

/**
 * @since 2.8.0
 */
export const failure = <E>(e: E) => replete(left(e));

/**
 * @since 2.8.1
 */
export const initial: DatumThese<never, never> = initialD;

/**
 * @since 2.8.1
 */
export const pending: DatumThese<never, never> = pendingD;

/**
 * @since 2.8.1
 */
export const constInitial = <E, D>(): DatumThese<E, D> => initial;

/**
 * @since 2.8.1
 */
export const constPending = <E, D>(): DatumThese<E, D> => pending;

export {
  /**
   * @since 2.8.0
   */
  isInitial,
  /**
   * @since 2.8.0
   */
  isPending,
  /**
   * @since 2.8.0
   */
  isRefresh,
  /**
   * @since 2.8.0
   */
  isReplete,
  /**
   * @since 2.8.0
   */
  isValued
};

/**
 * @since 2.8.0
 */
export const isRefreshLeft = <E, A>(
  fea: DatumThese<E, A>
): fea is Refresh<Left<E>> => isRefresh(fea) && isLeft(fea.value);

/**
 * @since 2.8.0
 */
export const isRefreshRight = <E, A>(
  fea: DatumThese<E, A>
): fea is Refresh<Right<A>> => isRefresh(fea) && isRight(fea.value);

/**
 * @since 2.8.0
 */
export const isRepleteLeft = <E, A>(
  fea: DatumThese<E, A>
): fea is Replete<Left<E>> => isReplete(fea) && isLeft(fea.value);

/**
 * @since 2.8.0
 */
export const isRepleteRight = <E, A>(
  fea: DatumThese<E, A>
): fea is Replete<Right<A>> => isReplete(fea) && isRight(fea.value);

/**
 * @since 2.8.0
 */
export const isSuccess = <E, A>(fea: DatumThese<E, A>): fea is Success<A> =>
  isValued(fea) && isRight(fea.value);

/**
 * @since 2.8.0
 */
export const isFailure = <E, A>(fea: DatumThese<E, A>): fea is Failure<E> =>
  isValued(fea) && isLeft(fea.value);

/**
 * @since 2.8.0
 */
export const toRefresh = <E, A>(fea: DatumThese<E, A>): DatumThese<E, A> =>
  datumFold<T.These<E, A>, DatumThese<E, A>>(
    constPending,
    constPending,
    constant(fea),
    refresh
  )(fea);

/**
 * @since 2.8.0
 */
export const toReplete = <E, A>(fea: DatumThese<E, A>): DatumThese<E, A> =>
  datumFold<T.These<E, A>, DatumThese<E, A>>(
    constInitial,
    constInitial,
    replete,
    constant(fea)
  )(fea);

/**
 * @since 2.8.0
 */
export const T.fromThese = <E, A>(e: Lazy<T.These<E, A>>): DatumThese<E, A> =>
  replete(e());

/**
 * @since 2.8.0
 */
export const fromOption = <E, A>(onNone: Lazy<E>) => (
  o: Option<A>
): DatumThese<unknown, A> => replete(T.TheseFromOption(onNone)(o));

/**
 * Takes a nullable value, if the value is not nully, turn it into a `Success<A>`, otherwise `Initial`.
 *
 * @since 2.8.0
 */
export const fromNullable = <E, A>(a: A | null | undefined): DatumThese<E, A> =>
  a === null || a === undefined ? initial : success(a);

/**
 * @since 2.8.0
 */
export const fold = <E, A, B>(
  onInitial: Lazy<B>,
  onPending: Lazy<B>,
  onRefreshLeft: FunctionN<[E], B>,
  onRefreshRight: FunctionN<[A], B>,
  onRepleteLeft: FunctionN<[E], B>,
  onRepleteRight: FunctionN<[A], B>
) => (fea: DatumThese<E, A>): B => {
  switch (fea._tag) {
    case 'Initial':
      return onInitial();
    case 'Pending':
      return onPending();
    case 'Refresh':
      return T.TheseFold(onRefreshLeft, onRefreshRight)(fea.value);
    case 'Replete':
      return T.TheseFold(onRepleteLeft, onRepleteRight)(fea.value);
  }
};

/**
 * @since 2.8.0
 */
export const refreshFold = <E, A, B>(
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: DatumThese<E, A>): B =>
  datumFold<T.These<E, A>, B>(
    onInitial,
    onPending,
    e => (isRight(e) ? onSuccess(e.right, true) : onFailure(e.left, true)),
    e => (isRight(e) ? onSuccess(e.right, false) : onFailure(e.left, false))
  )(fea);

/**
 * @since 2.8.0
 */
export const squash = <E, A, B>(
  onNone: (r?: boolean) => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: DatumThese<E, A>) =>
  datumFold<T.These<E, A>, B>(
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
  mapLeft
} = pipeable(DatumThese);

export {
  /**
   * @since 2.8.0
   */
  alt,
  /**
   * @since 2.8.0
   */
  ap,
  /**
   * @since 2.8.0
   */
  apFirst,
  /**
   * @since 2.8.0
   */
  apSecond,
  /**
   * @since 2.8.0
   */
  bimap,
  /**
   * @since 2.8.0
   */
  chain,
  /**
   * @since 2.8.0
   */
  chainFirst,
  /**
   * @since 2.8.0
   */
  flatten,
  /**
   * @since 2.8.0
   */
  map,
  /**
   * @since 2.8.0
   */
  mapLeft
};
