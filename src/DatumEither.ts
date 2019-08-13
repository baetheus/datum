import { Either } from 'fp-ts/es6/Either';
import { EitherM1, getEitherM } from 'fp-ts/es6/EitherT';
import { Monad2 } from 'fp-ts/es6/Monad';
import { pipeable } from 'fp-ts/es6/pipeable';

import { datum, Datum, URI as DatumURI } from './Datum';

/**
 * A Monad instance for `Datum<Either<E, A>>`
 *
 * @since 2.0.0
 */
declare module 'fp-ts/es6/HKT' {
  interface URItoKind2<E, A> {
    '@nll/async-data/datum-either': Datum<Either<E, A>>;
  }
}

/**
 * @since 2.0.0
 */
export const URI = '@nll/async-data/datum-either';

/**
 * @since 2.0.0
 */
export type URI = typeof URI;

/**
 * @since 2.0.0
 */
export const datumEither: Monad2<URI> & EitherM1<DatumURI> = {
  ...getEitherM(datum),
  URI,
};

export const {
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
} = pipeable(datumEither);
