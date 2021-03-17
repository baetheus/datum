/**
 * @since 4.0.0
 * 
 * Represents a value of one of eight possible types (a disjoint union).
 *
 * An instance of `DatumThese` is equivalent to `Datum<These<E, A>>`
 *
 * A common use of `DatumThese` is as a container for dealing with refreshable data values that
 * can have error conditions (including partial error conditions). The full type list is:
 *
 * - `Initial`
 * - `Pending`
 * - `Refresh<These<E, A>>`
 *   - `Refresh<Left<E>>`
 *   - `Refresh<Right<A>>`
 *   - `Refresh<Both<E, A>>`
 * - `Replete<Either<E, A>>`
 *   - `Replete<Left<E>>`
 *   - `Replete<Right<A>>`
 *   - `Replete<Both<E, A>>`
 *
 * There are additional helper methods for going from refresh to replete and back.
 * 
 */


import {
    Left,
    Right
} from 'fp-ts/es6/Either'
import {
    These,
    left,
    isRight,
    right,
    isLeft,
    both,
    isBoth,
    fold as theseFold,
    Both,
    getShow as theseGetShow,
    getEq as theseGetEq,
    getSemigroup as theseGetSemigroup,
} from 'fp-ts/es6/These'


import * as D from './Datum';
import { Option, fold as optionFold } from 'fp-ts/es6/Option';
import { constant, flow, FunctionN, Lazy, pipe } from 'fp-ts/es6/function'
import { Applicative, Applicative2C } from 'fp-ts/es6/Applicative';
import { HKT } from 'fp-ts/es6/HKT';
import { Semigroup } from 'fp-ts/es6/Semigroup';
import { Monoid } from 'fp-ts/es6/Monoid';
import { Traversable2 } from 'fp-ts/es6/Traversable';
import { getTheseM, TheseM1 } from 'fp-ts/lib/TheseT';
import { pipeable } from 'fp-ts/es6/pipeable';
import { Functor2 } from 'fp-ts/es6/Functor';
import { Apply2C } from 'fp-ts/es6/Apply';
import { Monad2C } from 'fp-ts/es6/Monad';
import { Chain2C } from 'fp-ts/es6/Chain';
import { Bifunctor2 } from 'fp-ts/es6/Bifunctor';
import { Foldable2 } from 'fp-ts/es6/Foldable';
import { MonadThrow2C } from 'fp-ts/es6/MonadThrow';
import { Show } from 'fp-ts/es6/Show';
import { Eq } from 'fp-ts/es6/Eq';

/**
 * A Monad instance for `Datum<These<E, A>>`
 *
 * @since 4.0.0
 */
 declare module 'fp-ts/es6/HKT' {
    interface URItoKind2<E, A> {
      '@nll/datum/DatumThese': D.Datum<These<E, A>>;
    }
  }

  /**
 * @since 4.0.0
 */
export const URI = '@nll/datum/DatumThese';

/**
 * @since 4.0.0
 */
export type URI = typeof URI;

/**
 * @since 4.0.0
 */
 export type DatumThese<E, A> = D.Datum<These<E, A>>;

 /**
  * @since 4.0.0
  */
 export type Valued<A> = D.Refresh<A> | D.Replete<A>;
 
 /**
  * @since 4.0.0
  */
 export type Success<A> = Valued<Right<A>>;
 
 /**
  * @since 4.0.0
  */
 export type Failure<E> = Valued<Left<E>>;

 /**
  * @since 4.0.0
  */
 export type PartialSuccess<E, A> = Valued<Both<E, A>>
 
 /**
  * @since 4.0.0
  */
 export type ToLeft<T> = T extends DatumThese<infer L, infer _> ? L : never;
 
 /**
  * @since 4.0.0
  */
 export type ToRight<T> = T extends DatumThese<infer _, infer R> ? R : never;

/**
 * @since 4.0.0
 */
 export const initial: DatumThese<never, never> = D.initial;

 /**
  * @since 4.0.0
  */
 export const pending: DatumThese<never, never> = D.pending;
 
 /**
 * @since 4.0.0
 */
export const success = <E = never, A = never>(a: A): DatumThese<E, A> =>
    D.replete(right(a));

/**
* @since 4.0.0
*/
export const failure = <E = never, A = never>(e: E): DatumThese<E, A> =>
    D.replete(left(e));

/**
* @since 4.0.0
*/
export const partialSuccess = <E = never, A = never>(e: E, a: A): DatumThese<E, A> => 
    D.replete(both(e, a))

/**
* @since 4.0.0
*/
export const successR = <E = never, A = never>(a: A): DatumThese<E, A> =>
    D.refresh(right(a));

/**
* @since 4.0.0
*/
export const failureR = <E = never, A = never>(e: E): DatumThese<E, A> =>
    D.refresh(left(e));

/**
* @since 4.0.0
*/
export const partialSuccessR = <E = never, A = never>(e: E, a: A): DatumThese<E, A> => 
    D.refresh(both(e, a))

/**
 * @since 4.0.0
 */
export function constInitial<E = never, D = never>(): DatumThese<E, D> {
    return initial;
}
  
  /**
   * @since 4.0.0
   */
export const constPending = <E = never, D = never>(): DatumThese<E, D> =>
    pending;

/**
 * @since 4.0.0
 */
export const isInitial = D.isInitial;

/**
 * @since 4.0.0
 */
export const isPending = D.isPending;

/**
 * @since 4.0.0
 */
export const isRefresh = D.isRefresh;

/**
 * @since 4.0.0
 */
export const isReplete = D.isReplete;
 
/**
 * @since 4.0.0
 */
export const isValued = D.isValued;
 
/**
 * @since 4.0.0
 */
export const isRefreshLeft = <E, A>(
    fea: DatumThese<E, A>
): fea is D.Refresh<Left<E>> => isRefresh(fea) && isLeft(fea.value);
  
/**
 * @since 4.0.0
 */
export const isRefreshRight = <E, A>(
    fea: DatumThese<E, A>
): fea is D.Refresh<Right<A>> => isRefresh(fea) && isRight(fea.value);

/**
 * @since 4.0.0
 */
export const isRefreshBoth = <E, A>(
    fea: DatumThese<E, A>
): fea is D.Refresh<Both<E, A>> => isRefresh(fea) && isBoth(fea.value)

/**
 * @since 4.0.0
 */
export const isRepleteLeft = <E, A>(
    fea: DatumThese<E, A>
): fea is D.Replete<Left<E>> => isReplete(fea) && isLeft(fea.value);

/**
 * @since 4.0.0
 */
export const isRepleteRight = <E, A>(
    fea: DatumThese<E, A>
): fea is D.Replete<Right<A>> => isReplete(fea) && isRight(fea.value);

/**
 * @since 4.0.0
 */
export const isRepleteBoth = <E, A>(
    fea: DatumThese<E, A>
): fea is D.Replete<Both<E, A>> => isReplete(fea) && isBoth(fea.value)


/**
 * @since 4.0.0
 */
export const isSuccess = <E, A>(fea: DatumThese<E, A>): fea is Success<A> =>
    isValued(fea) && isRight(fea.value);

/**
* @since 4.0.0
*/
export const isFailure = <E, A>(fea: DatumThese<E, A>): fea is Failure<E> =>
    isValued(fea) && isLeft(fea.value);

/**
 * @since 4.0.0
 */
export const isPartialSuccess = <E, A>(fea: DatumThese<E, A>): fea is PartialSuccess<E, A> =>
    isValued(fea) && isBoth(fea.value);

/**
 * @since 4.0.0
 */
export const toRefresh = <E, A>(fea: DatumThese<E, A>): DatumThese<E, A> =>
    D.fold<These<E, A>, DatumThese<E, A>>(
        constPending,
        constPending,
        constant(fea),
        D.refresh
    )(fea);

/**
 * @since 4.0.0
 */
export const toReplete = <E, A>(fea: DatumThese<E, A>): DatumThese<E, A> =>
    D.fold<These<E, A>, DatumThese<E, A>>(
        constInitial,
        constInitial,
        D.replete,
        constant(fea)
)(fea);

// TODO - fromThese vs fromThese2 ? Either equivalents are marked deprecated


/**
 * @since 4.0.0
 */
export const fromOption = <E, A>(onNone: Lazy<E>) => (
    o: Option<A>
): DatumThese<E, A> => D.replete(optionFold<A, These<E, A>>(() => left(onNone()), right)(o));

/**
 * Takes a nullable value, if the value is not nully, turn it into a `Success<A>`, otherwise `Initial`.
 *
 * @since 4.0.0
 */
export const fromNullable = <E, A>(
    a: A | null | undefined
): DatumThese<E, A> => (a === null || a === undefined ? initial : success(a));

/**
 * @since 4.0.0
 */
 export const fold = <E, A, B>(
    onInitial: Lazy<B>,
    onPending: Lazy<B>,
    onRefreshLeft: FunctionN<[E], B>,
    onRefreshRight: FunctionN<[A], B>,
    onRefreshBoth: FunctionN<[E, A], B>,
    onRepleteLeft: FunctionN<[E], B>,
    onRepleteRight: FunctionN<[A], B>,
    onRepleteBoth: FunctionN<[E, A], B>
) => (fea: DatumThese<E, A>): B =>
    pipe(
        fea,
        D.fold(
        onInitial,
        onPending,
        theseFold(onRefreshLeft, onRefreshRight, onRefreshBoth),
        theseFold(onRepleteLeft, onRepleteRight, onRepleteBoth)
        )
    );

/**
 * @since 4.0.0
 */
 export const refreshFold = <E, A, B>(
    onInitial: () => B,
    onPending: () => B,
    onFailure: (e: E, r?: boolean) => B,
    onSuccess: (a: A, r?: boolean) => B,
    onPartialSuccess: (e: E, a: A, r?: boolean) => B
  ) => (fea: DatumThese<E, A>): B =>
    D.fold<These<E, A>, B>(
      onInitial,
      onPending,
      (e) => (isRight(e) ? onSuccess(e.right, true) : isBoth(e) ? onPartialSuccess(e.left, e.right, true) : onFailure(e.left, true)),
      (e) => (isRight(e) ? onSuccess(e.right, false) : isBoth(e) ? onPartialSuccess(e.left, e.right, false) :  onFailure(e.left, false))
)(fea);
  
/**
 * @since 4.0.0
 */
 export const squash = <E, A, B>(
    onNone: (r?: boolean) => B,
    onFailure: (e: E, r?: boolean) => B,
    onSuccess: (a: A, r?: boolean) => B,
    onPartialSuccess: (e: E, a: A, r?: boolean) => B
  ) => (fea: DatumThese<E, A>) =>
    D.fold<These<E, A>, B>(
      () => onNone(false),
      () => onNone(true),
      (e) => (isRight(e) ? onSuccess(e.right, true) : isBoth(e) ? onPartialSuccess(e.left, e.right, true) : onFailure(e.left, true)),
      (e) => (isRight(e) ? onSuccess(e.right, false) : isBoth(e) ? onPartialSuccess(e.left, e.right, false) : onFailure(e.left, false))
    )(fea);

/**
 * @since 4.0.0
 */
 const traverseC = <F>(F: Applicative<F>) => <E, A, B>(
    ta: DatumThese<E, A>,
    f: (a: A) => HKT<F, B>
  ): HKT<F, DatumThese<E, B>> =>
    fold<E, A, HKT<F, DatumThese<E, B>>>(
      () => F.of(initial),
      () => F.of(pending),
      (e) => F.of(D.refresh(left(e))),
      (a) => F.map(f(a), flow(right, D.refresh)),
      (e, a) => F.map(f(a), flow(b => both(e, b), D.refresh)),
      (e) => F.of(D.replete(left(e))),
      (a) => F.map(f(a), flow(right, D.replete)),
      (e, a) => F.map(f(a), flow(b => both(e, b), D.replete))
    )(ta);

/**
 * @since 4.0.0
 */
 const sequenceC = <F>(F: Applicative<F>) => <E, A>(
    ta: DatumThese<E, HKT<F, A>>
  ): HKT<F, DatumThese<E, A>> =>
    fold<E, HKT<F, A>, HKT<F, DatumThese<E, A>>>(
      () => F.of(initial),
      () => F.of(pending),
      (e) => F.of(D.refresh(left(e))),
      (a) => F.map(a, flow(right, D.refresh)),
      (e, a) => F.map(a, flow(b => both(e, b), D.refresh)),
      (e) => F.of(D.replete(left(e))),
      (a) => F.map(a, flow(right, D.replete)),
      (e, a) => F.map(a, flow(b => both(e, b), D.replete))
    )(ta);

/**
 * @since 4.0.0
 */
 const reduceC = <E, A, B>(
    fa: DatumThese<E, A>,
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
        (e, a) => f(b, a),
        () => b,
        (a) => f(b, a),
        (e, a) => f(b, a)
      )
    );
  
/**
 * @since 4.0.0
 */
 const foldMapC = <M>(M: Monoid<M>) => <E, A>(
    fa: DatumThese<E, A>,
    f: (a: A) => M
  ): M =>
    fold<E, A, M>(
      () => M.empty,
      () => M.empty,
      () => M.empty,
      f,
      (e, a) => f(a),
      () => M.empty,
      f,
      (e, a) => f(a)
    )(fa);
  
/**
 * @since 4.0.0
 */
 const reduceRightC = <E, A, B>(
    fa: DatumThese<E, A>,
    b: B,
    f: (a: A, b: B) => B
  ): B =>
    fold<E, A, B>(
      () => b,
      () => b,
      () => b,
      (a) => f(a, b),
      (e, a) => f(a, b),
      () => b,
      (a) => f(a, b),
      (e, a) => f(a, b)
    )(fa);
  
// TODO: After we bump the min bound to >= 2.10, replace this with individual helper fns
// Also, fix the instance factories below to not re-use getMonad for better tree-shaking.
const theseTDatum: Traversable2<URI> & TheseM1<D.URI> = {
    URI,
    ...getTheseM(D.datum),
    traverse: traverseC,
    sequence: sequenceC,
    reduce: reduceC,
    foldMap: foldMapC,
    reduceRight: reduceRightC,
  };

/**
 * @since 4.0.0
 */
export const Functor: Functor2<URI> = {
  URI,
  map: theseTDatum.map
};

const {
  map
} = pipeable(Functor);

/**
 * @since 4.0.0
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  mapLeft: theseTDatum.mapLeft,
  bimap: theseTDatum.bimap
}

const {
  mapLeft,
  bimap
} = pipeable(Bifunctor);

/**
 * @since 4.0.0
 */
export const getMonad = <E>(S: Semigroup<E>): Monad2C<URI, E> => ({
  ...theseTDatum.getMonad(S),
  URI
});

/**
 * @since 4.0.0
 */
export const getMonadThrow = <E>(S: Semigroup<E>): MonadThrow2C<URI, E> => ({
  ...theseTDatum.getMonad(S),
  URI,
  throwError: failure
})

/**
 * @since 4.0.0
 */
 export const getChain = <E>(S: Semigroup<E>): Chain2C<URI, E> => ({
  ...theseTDatum.getMonad(S),
  URI
});

/**
 * @since 4.0.0
 */
export const getApplicative = <E>(S: Semigroup<E>): Applicative2C<URI, E> => ({
  ...theseTDatum.getMonad(S),
  URI
});

/**
 * @since 4.0.0
 */
 export const getApply = <E>(S: Semigroup<E>): Apply2C<URI, E> => ({
  ...theseTDatum.getMonad(S),
  URI
});

/**
 * @since 4.0.0
 */
export const Foldable: Foldable2<URI> = {
  URI,
  reduce: reduceC,
  reduceRight: reduceRightC,
  foldMap: foldMapC
};

const {
  reduce,
  reduceRight,
  foldMap
} = pipeable(Foldable);

/**
 * @since 4.0.0
 */
export const Traversable: Traversable2<URI> = {
  ...Functor,
  ...Foldable,
  sequence: sequenceC,
  traverse: traverseC
}

/**
 * @since 4.0.0
 */
export const getShow = <E, A>(SE: Show<E>, SA: Show<A>): Show<DatumThese<E, A>> => 
  D.getShow(theseGetShow(SE, SA));

/**
 * @since 4.0.0
 */
export const getEq = <E, A>(EE: Eq<E>, EA: Eq<A>): Eq<DatumThese<E, A>> => 
  D.getEq(theseGetEq(EE, EA))

/**
 * @since 4.0.0
 */
export const getApplySemigroup = <E, A>(SE: Semigroup<E>, SA: Semigroup<A>): Semigroup<DatumThese<E, A>> =>
  D.getApplySemigroup(theseGetSemigroup(SE, SA))

/**
 * @since 4.0.0
 */
 export const getProgressSemigroup = <E, A>(SE: Semigroup<E>, SA: Semigroup<A>): Semigroup<DatumThese<E, A>> =>
   D.getProgressSemigroup(theseGetSemigroup(SE, SA))

/**
 * @since 4.0.0
 */
 export const getProgressMonoid = <E, A>(SE: Semigroup<E>, SA: Semigroup<A>): Monoid<DatumThese<E, A>> =>
   D.getProgressMonoid(theseGetSemigroup(SE, SA))


export {
    /**
     * @since 4.0.0
     */
    bimap,
    /**
     * @since 4.0.0
     */
    map,
    /**
     * @since 4.0.0
     */
    mapLeft,
    /**
     * @since 4.0.0
     */
    reduce,
    /**
     * @since 4.0.0
     */
    foldMap,
    /**
     * @since 4.0.0
     */
    reduceRight,
};
