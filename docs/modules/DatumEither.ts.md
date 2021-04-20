---
title: DatumEither.ts
nav_order: 2
parent: Modules
---

## DatumEither overview

Added in v2.0.0

Represents a value of one of six possible types (a disjoint union).

An instance of `DatumEither` is equivalent to `Datum<Either<E, A>>`

A common use of `DatumEither` is as a container for dealing with refreshable data values that
can have error conditions. The full type list is:

- `Initial`
- `Pending`
- `Refresh<Either<E, A>>`
  - `Refresh<Left<E>>`
  - `Refresh<Right<A>>`
- `Replete<Either<E, A>>`
  - `Replete<Left<E>>`
  - `Replete<Right<A>>`

There are additional helper methods for going from refresh to replete and back.

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Alt](#alt)
  - [Alternative](#alternative)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Bifunctor](#bifunctor)
  - [Chain](#chain)
  - [DatumEither (type alias)](#datumeither-type-alias)
  - [Failure (type alias)](#failure-type-alias)
  - [Foldable](#foldable)
  - [Functor](#functor)
  - [Monad](#monad)
  - [MonadThrow](#monadthrow)
  - [Success (type alias)](#success-type-alias)
  - [ToLeft (type alias)](#toleft-type-alias)
  - [ToRight (type alias)](#toright-type-alias)
  - [Traversable](#traversable)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [Valued (type alias)](#valued-type-alias)
  - [alt](#alt)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [bimap](#bimap)
  - [chain](#chain)
  - [chainFirst](#chainfirst)
  - [constInitial](#constinitial)
  - [constPending](#constpending)
  - [failure](#failure)
  - [failureR](#failurer)
  - [flatten](#flatten)
  - [fold](#fold)
  - [foldMap](#foldmap)
  - [fromNullable](#fromnullable)
  - [fromOption](#fromoption)
  - [getApplySemigroup](#getapplysemigroup)
  - [getMonoid](#getmonoid)
  - [getSemigroup](#getsemigroup)
  - [initial](#initial)
  - [isFailure](#isfailure)
  - [isInitial](#isinitial)
  - [isPending](#ispending)
  - [isRefresh](#isrefresh)
  - [isRefreshLeft](#isrefreshleft)
  - [isRefreshRight](#isrefreshright)
  - [isReplete](#isreplete)
  - [isRepleteLeft](#isrepleteleft)
  - [isRepleteRight](#isrepleteright)
  - [isSuccess](#issuccess)
  - [isValued](#isvalued)
  - [map](#map)
  - [mapLeft](#mapleft)
  - [pending](#pending)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
  - [refreshFold](#refreshfold)
  - [sequenceStruct](#sequencestruct)
  - [sequenceTuple](#sequencetuple)
  - [squash](#squash)
  - [success](#success)
  - [successR](#successr)
  - [toRefresh](#torefresh)
  - [toReplete](#toreplete)
  - [~~fromEither2~~](#fromeither2)
  - [~~fromEither~~](#fromeither)

---

# utils

## Alt

**Signature**

```ts
export declare const Alt: Alt2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## Alternative

**Signature**

```ts
export declare const Alternative: Alternative2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## Applicative

**Signature**

```ts
export declare const Applicative: Applicative2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## Apply

**Signature**

```ts
export declare const Apply: Apply2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

Note: This instance agrees with the standalone Applicative/Chain/Monad instances but _disagrees_ with the deprecated `datum` mega-instance.

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: Bifunctor2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## Chain

**Signature**

```ts
export declare const Chain: Chain2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## DatumEither (type alias)

**Signature**

```ts
export type DatumEither<E, A> = D.Datum<Either<E, A>>
```

Added in v2.1.0

## Failure (type alias)

**Signature**

```ts
export type Failure<E> = Valued<Left<E>>
```

Added in v2.3.0

## Foldable

**Signature**

```ts
export declare const Foldable: Foldable2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## Monad

**Signature**

```ts
export declare const Monad: Monad2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## MonadThrow

**Signature**

```ts
export declare const MonadThrow: MonadThrow2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## Success (type alias)

**Signature**

```ts
export type Success<A> = Valued<Right<A>>
```

Added in v2.3.0

## ToLeft (type alias)

**Signature**

```ts
export type ToLeft<T> = T extends DatumEither<infer L, infer _> ? L : never
```

Added in v3.2.0

## ToRight (type alias)

**Signature**

```ts
export type ToRight<T> = T extends DatumEither<infer _, infer R> ? R : never
```

Added in v3.2.0

## Traversable

**Signature**

```ts
export declare const Traversable: Traversable2<'@nll/datum/DatumEither'>
```

Added in v3.5.0

## URI

**Signature**

```ts
export declare const URI: '@nll/datum/DatumEither'
```

Added in v2.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.0.0

## Valued (type alias)

**Signature**

```ts
export type Valued<A> = D.Refresh<A> | D.Replete<A>
```

Added in v3.4.0

## alt

**Signature**

```ts
export declare const alt: <E, A>(
  that: Lazy<D.Datum<Either<E, A>>>
) => (fa: D.Datum<Either<E, A>>) => D.Datum<Either<E, A>>
```

Added in v2.0.0

## ap

**Signature**

```ts
export declare const ap: <E, A>(
  fa: D.Datum<Either<E, A>>
) => <B>(fab: D.Datum<Either<E, (a: A) => B>>) => D.Datum<Either<E, B>>
```

Added in v2.0.0 (new semantics since 4.0.0)

## apFirst

**Signature**

```ts
export declare const apFirst: <E, B>(
  fb: D.Datum<Either<E, B>>
) => <A>(fa: D.Datum<Either<E, A>>) => D.Datum<Either<E, A>>
```

Added in v2.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <E, B>(
  fb: D.Datum<Either<E, B>>
) => <A>(fa: D.Datum<Either<E, A>>) => D.Datum<Either<E, B>>
```

Added in v2.0.0

## bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: D.Datum<Either<E, A>>) => D.Datum<Either<G, B>>
```

Added in v2.0.0

## chain

**Signature**

```ts
export declare const chain: <E, A, B>(
  f: (a: A) => D.Datum<Either<E, B>>
) => (ma: D.Datum<Either<E, A>>) => D.Datum<Either<E, B>>
```

Added in v2.0.0

## chainFirst

**Signature**

```ts
export declare const chainFirst: <E, A, B>(
  f: (a: A) => D.Datum<Either<E, B>>
) => (ma: D.Datum<Either<E, A>>) => D.Datum<Either<E, A>>
```

Added in v2.0.0

## constInitial

**Signature**

```ts
export declare function constInitial<E = never, D = never>(): DatumEither<E, D>
```

Added in v2.4.1

## constPending

**Signature**

```ts
export declare const constPending: <E = never, D = never>() => D.Datum<Either<E, D>>
```

Added in v2.4.1

## failure

**Signature**

```ts
export declare const failure: <E = never, A = never>(e: E) => D.Datum<Either<E, A>>
```

Added in v2.1.0

## failureR

**Signature**

```ts
export declare const failureR: <E = never, A = never>(e: E) => D.Datum<Either<E, A>>
```

Added in v3.4.0

## flatten

**Signature**

```ts
export declare const flatten: <E, A>(mma: D.Datum<Either<E, D.Datum<Either<E, A>>>>) => D.Datum<Either<E, A>>
```

Added in v2.0.0

## fold

**Signature**

```ts
export declare const fold: <E, A, B>(
  onInitial: Lazy<B>,
  onPending: Lazy<B>,
  onRefreshLeft: FunctionN<[E], B>,
  onRefreshRight: FunctionN<[A], B>,
  onRepleteLeft: FunctionN<[E], B>,
  onRepleteRight: FunctionN<[A], B>
) => (fea: D.Datum<Either<E, A>>) => B
```

Added in v2.7.0

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <E>(fa: D.Datum<Either<E, A>>) => M
```

Added in v3.4.0

## fromNullable

Takes a nullable value, if the value is not nully, turn it into a `Success<A>`, otherwise `Initial`.

**Signature**

```ts
export declare const fromNullable: <E, A>(a: A) => D.Datum<Either<E, A>>
```

Added in v2.4.0

## fromOption

**Signature**

```ts
export declare const fromOption: <E, A>(onNone: Lazy<E>) => (o: Option<A>) => D.Datum<Either<E, A>>
```

Added in v2.2.0

## getApplySemigroup

**Signature**

```ts
export declare const getApplySemigroup: <E, A>(S: Semigroup<Either<E, A>>) => Semigroup<D.Datum<Either<E, A>>>
```

Added in v4.0.0

## getMonoid

**Signature**

```ts
export declare const getMonoid: <E, A>(S: Semigroup<Either<E, A>>) => Monoid<D.Datum<Either<E, A>>>
```

Added in v4.0.0

## getSemigroup

**Signature**

```ts
export declare const getSemigroup: <E, A>(S: Semigroup<Either<E, A>>) => Semigroup<D.Datum<Either<E, A>>>
```

Added in v4.0.0

## initial

**Signature**

```ts
export declare const initial: D.Datum<Either<never, never>>
```

Added in v2.4.1

## isFailure

**Signature**

```ts
export declare const isFailure: <E, A>(fea: D.Datum<Either<E, A>>) => fea is Valued<Left<E>>
```

Added in v2.1.0

## isInitial

**Signature**

```ts
export declare const isInitial: <A>(ma: D.Datum<A>) => ma is D.Initial
```

Added in v2.7.0

## isPending

**Signature**

```ts
export declare const isPending: <A>(ma: D.Datum<A>) => ma is D.Pending
```

Added in v2.7.0

## isRefresh

**Signature**

```ts
export declare const isRefresh: <A>(ma: D.Datum<A>) => ma is D.Refresh<A>
```

Added in v2.7.0

## isRefreshLeft

**Signature**

```ts
export declare const isRefreshLeft: <E, A>(fea: D.Datum<Either<E, A>>) => fea is D.Refresh<Left<E>>
```

Added in v2.7.0

## isRefreshRight

**Signature**

```ts
export declare const isRefreshRight: <E, A>(fea: D.Datum<Either<E, A>>) => fea is D.Refresh<Right<A>>
```

Added in v2.7.0

## isReplete

**Signature**

```ts
export declare const isReplete: <A>(ma: D.Datum<A>) => ma is D.Replete<A>
```

Added in v2.7.0

## isRepleteLeft

**Signature**

```ts
export declare const isRepleteLeft: <E, A>(fea: D.Datum<Either<E, A>>) => fea is D.Replete<Left<E>>
```

Added in v2.7.0

## isRepleteRight

**Signature**

```ts
export declare const isRepleteRight: <E, A>(fea: D.Datum<Either<E, A>>) => fea is D.Replete<Right<A>>
```

Added in v2.7.0

## isSuccess

**Signature**

```ts
export declare const isSuccess: <E, A>(fea: D.Datum<Either<E, A>>) => fea is Valued<Right<A>>
```

Added in v2.1.0

## isValued

**Signature**

```ts
export declare const isValued: <A>(ma: D.Datum<A>) => ma is D.Replete<A> | D.Refresh<A>
```

Added in v2.7.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: D.Datum<Either<E, A>>) => D.Datum<Either<E, B>>
```

Added in v2.0.0

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: D.Datum<Either<E, A>>) => D.Datum<Either<G, A>>
```

Added in v2.0.0

## pending

**Signature**

```ts
export declare const pending: D.Datum<Either<never, never>>
```

Added in v2.4.1

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <E>(fa: D.Datum<Either<E, A>>) => B
```

Added in v3.4.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <E>(fa: D.Datum<Either<E, A>>) => B
```

Added in v3.4.0

## refreshFold

**Signature**

```ts
export declare const refreshFold: <E, A, B>(
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: D.Datum<Either<E, A>>) => B
```

Added in v2.1.0

## sequenceStruct

**Signature**

```ts
export declare const sequenceStruct: <E, NER>(
  r: (keyof NER extends never ? never : NER) & Record<string, D.Datum<Either<E, any>>>
) => D.Datum<Either<E, { [K in keyof NER]: [NER[K]] extends [D.Datum<Either<any, infer A>>] ? A : never }>>
```

Added in v3.2.0 (new semantics since 4.0.0)

## sequenceTuple

**Signature**

```ts
export declare const sequenceTuple: <E, T>(
  ...t: T & { readonly 0: D.Datum<Either<E, any>> }
) => D.Datum<Either<E, { [K in keyof T]: [T[K]] extends [D.Datum<Either<E, infer A>>] ? A : never }>>
```

Added in v3.2.0 (new semantics since 4.0.0)

## squash

**Signature**

```ts
export declare const squash: <E, A, B>(
  onNone: (r?: boolean) => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: D.Datum<Either<E, A>>) => B
```

Added in v2.3.0

## success

**Signature**

```ts
export declare const success: <E = never, A = never>(a: A) => D.Datum<Either<E, A>>
```

Added in v2.1.0

## successR

**Signature**

```ts
export declare const successR: <E = never, A = never>(a: A) => D.Datum<Either<E, A>>
```

Added in v3.4.0

## toRefresh

**Signature**

```ts
export declare const toRefresh: <E, A>(fea: D.Datum<Either<E, A>>) => D.Datum<Either<E, A>>
```

Added in v2.1.0

## toReplete

**Signature**

```ts
export declare const toReplete: <E, A>(fea: D.Datum<Either<E, A>>) => D.Datum<Either<E, A>>
```

Added in v2.7.0

## ~~fromEither2~~

fromEither2 will replace fromEither in the next major release

**Signature**

```ts
export declare const fromEither2: <E, A>(e: Either<E, A>) => D.Datum<Either<E, A>>
```

Added in v3.4.0

## ~~fromEither~~

fromEither will remove the Lazy input in the next major release

**Signature**

```ts
export declare const fromEither: <E, A>(e: Lazy<Either<E, A>>) => D.Datum<Either<E, A>>
```

Added in v2.2.0
