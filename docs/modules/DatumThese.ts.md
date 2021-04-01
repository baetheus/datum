---
title: DatumThese.ts
nav_order: 3
parent: Modules
---

## DatumThese overview

Added in v3.5.0

Represents a value of one of eight possible types (a disjoint union).

An instance of `DatumThese` is equivalent to `Datum<These<E, A>>`

A common use of `DatumThese` is as a container for dealing with refreshable data values that
can have error conditions (including partial error conditions). The full type list is:

- `Initial`
- `Pending`
- `Refresh<These<E, A>>`
  - `Refresh<Left<E>>`
  - `Refresh<Right<A>>`
  - `Refresh<Both<E, A>>`
- `Replete<Either<E, A>>`
  - `Replete<Left<E>>`
  - `Replete<Right<A>>`
  - `Replete<Both<E, A>>`

There are additional helper methods for going from refresh to replete and back.

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Bifunctor](#bifunctor)
  - [DatumThese (type alias)](#datumthese-type-alias)
  - [Failure (type alias)](#failure-type-alias)
  - [Foldable](#foldable)
  - [Functor](#functor)
  - [PartialSuccess (type alias)](#partialsuccess-type-alias)
  - [Success (type alias)](#success-type-alias)
  - [ToLeft (type alias)](#toleft-type-alias)
  - [ToRight (type alias)](#toright-type-alias)
  - [Traversable](#traversable)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [Valued (type alias)](#valued-type-alias)
  - [bimap](#bimap)
  - [constInitial](#constinitial)
  - [constPending](#constpending)
  - [failure](#failure)
  - [failureR](#failurer)
  - [fold](#fold)
  - [foldMap](#foldmap)
  - [fromNullable](#fromnullable)
  - [fromOption](#fromoption)
  - [getApplicative](#getapplicative)
  - [getApply](#getapply)
  - [getApplySemigroup](#getapplysemigroup)
  - [getChain](#getchain)
  - [getEq](#geteq)
  - [getMonad](#getmonad)
  - [getMonadThrow](#getmonadthrow)
  - [getShow](#getshow)
  - [initial](#initial)
  - [isFailure](#isfailure)
  - [isInitial](#isinitial)
  - [isPartialSuccess](#ispartialsuccess)
  - [isPending](#ispending)
  - [isRefresh](#isrefresh)
  - [isRefreshBoth](#isrefreshboth)
  - [isRefreshLeft](#isrefreshleft)
  - [isRefreshRight](#isrefreshright)
  - [isReplete](#isreplete)
  - [isRepleteBoth](#isrepleteboth)
  - [isRepleteLeft](#isrepleteleft)
  - [isRepleteRight](#isrepleteright)
  - [isSuccess](#issuccess)
  - [isValued](#isvalued)
  - [map](#map)
  - [mapLeft](#mapleft)
  - [partialSuccess](#partialsuccess)
  - [partialSuccessR](#partialsuccessr)
  - [pending](#pending)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
  - [refreshFold](#refreshfold)
  - [squash](#squash)
  - [success](#success)
  - [successR](#successr)
  - [toRefresh](#torefresh)
  - [toReplete](#toreplete)

---

# utils

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: Bifunctor2<'@nll/datum/DatumThese'>
```

Added in v3.5.0

## DatumThese (type alias)

**Signature**

```ts
export type DatumThese<E, A> = D.Datum<These<E, A>>
```

Added in v3.5.0

## Failure (type alias)

**Signature**

```ts
export type Failure<E> = Valued<Left<E>>
```

Added in v3.5.0

## Foldable

**Signature**

```ts
export declare const Foldable: Foldable2<'@nll/datum/DatumThese'>
```

Added in v3.5.0

## Functor

**Signature**

```ts
export declare const Functor: Functor2<'@nll/datum/DatumThese'>
```

Added in v3.5.0

## PartialSuccess (type alias)

**Signature**

```ts
export type PartialSuccess<E, A> = Valued<Both<E, A>>
```

Added in v3.5.0

## Success (type alias)

**Signature**

```ts
export type Success<A> = Valued<Right<A>>
```

Added in v3.5.0

## ToLeft (type alias)

**Signature**

```ts
export type ToLeft<T> = T extends DatumThese<infer L, infer _> ? L : never
```

Added in v3.5.0

## ToRight (type alias)

**Signature**

```ts
export type ToRight<T> = T extends DatumThese<infer _, infer R> ? R : never
```

Added in v3.5.0

## Traversable

**Signature**

```ts
export declare const Traversable: Traversable2<'@nll/datum/DatumThese'>
```

Added in v3.5.0

## URI

**Signature**

```ts
export declare const URI: '@nll/datum/DatumThese'
```

Added in v3.5.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.5.0

## Valued (type alias)

**Signature**

```ts
export type Valued<A> = D.Refresh<A> | D.Replete<A>
```

Added in v3.5.0

## bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: D.Datum<These<E, A>>) => D.Datum<These<G, B>>
```

Added in v3.5.0

## constInitial

**Signature**

```ts
export declare function constInitial<E = never, D = never>(): DatumThese<E, D>
```

Added in v3.5.0

## constPending

**Signature**

```ts
export declare const constPending: <E = never, D = never>() => D.Datum<These<E, D>>
```

Added in v3.5.0

## failure

**Signature**

```ts
export declare const failure: <E = never, A = never>(e: E) => D.Datum<These<E, A>>
```

Added in v3.5.0

## failureR

**Signature**

```ts
export declare const failureR: <E = never, A = never>(e: E) => D.Datum<These<E, A>>
```

Added in v3.5.0

## fold

**Signature**

```ts
export declare const fold: <E, A, B>(
  onInitial: Lazy<B>,
  onPending: Lazy<B>,
  onRefreshLeft: FunctionN<[E], B>,
  onRefreshRight: FunctionN<[A], B>,
  onRefreshBoth: FunctionN<[E, A], B>,
  onRepleteLeft: FunctionN<[E], B>,
  onRepleteRight: FunctionN<[A], B>,
  onRepleteBoth: FunctionN<[E, A], B>
) => (fea: D.Datum<These<E, A>>) => B
```

Added in v3.5.0

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <E>(fa: D.Datum<These<E, A>>) => M
```

Added in v3.5.0

## fromNullable

Takes a nullable value, if the value is not nully, turn it into a `Success<A>`, otherwise `Initial`.

**Signature**

```ts
export declare const fromNullable: <E, A>(a: A | null | undefined) => D.Datum<These<E, A>>
```

Added in v3.5.0

## fromOption

**Signature**

```ts
export declare const fromOption: <E, A>(onNone: Lazy<E>) => (o: Option<A>) => D.Datum<These<E, A>>
```

Added in v3.5.0

## getApplicative

**Signature**

```ts
export declare const getApplicative: <E>(S: Semigroup<E>) => Applicative2C<'@nll/datum/DatumThese', E>
```

Added in v3.5.0

## getApply

**Signature**

```ts
export declare const getApply: <E>(S: Semigroup<E>) => Apply2C<'@nll/datum/DatumThese', E>
```

Added in v3.5.0

## getApplySemigroup

**Signature**

```ts
export declare const getApplySemigroup: <E, A>(S: Semigroup<These<E, A>>) => Semigroup<D.Datum<These<E, A>>>
```

Added in v3.5.0

Note: As this was introduced after the deprecation of `Datum.datum.ap`, this currently relies on the future
functionality in `Datum.Apply.ap`.

## getChain

**Signature**

```ts
export declare const getChain: <E>(S: Semigroup<E>) => Chain2C<'@nll/datum/DatumThese', E>
```

Added in v3.5.0

## getEq

**Signature**

```ts
export declare const getEq: <E, A>(EE: Eq<E>, EA: Eq<A>) => Eq<D.Datum<These<E, A>>>
```

Added in v3.5.0

## getMonad

**Signature**

```ts
export declare const getMonad: <E>(S: Semigroup<E>) => Monad2C<'@nll/datum/DatumThese', E>
```

Added in v3.5.0

## getMonadThrow

**Signature**

```ts
export declare const getMonadThrow: <E>(S: Semigroup<E>) => MonadThrow2C<'@nll/datum/DatumThese', E>
```

Added in v3.5.0

## getShow

**Signature**

```ts
export declare const getShow: <E, A>(SE: Show<E>, SA: Show<A>) => Show<D.Datum<These<E, A>>>
```

Added in v3.5.0

## initial

**Signature**

```ts
export declare const initial: D.Datum<These<never, never>>
```

Added in v3.5.0

## isFailure

**Signature**

```ts
export declare const isFailure: <E, A>(fea: D.Datum<These<E, A>>) => fea is Valued<Left<E>>
```

Added in v3.5.0

## isInitial

**Signature**

```ts
export declare const isInitial: <A>(ma: D.Datum<A>) => ma is D.Initial
```

Added in v3.5.0

## isPartialSuccess

**Signature**

```ts
export declare const isPartialSuccess: <E, A>(fea: D.Datum<These<E, A>>) => fea is Valued<Both<E, A>>
```

Added in v3.5.0

## isPending

**Signature**

```ts
export declare const isPending: <A>(ma: D.Datum<A>) => ma is D.Pending
```

Added in v3.5.0

## isRefresh

**Signature**

```ts
export declare const isRefresh: <A>(ma: D.Datum<A>) => ma is D.Refresh<A>
```

Added in v3.5.0

## isRefreshBoth

**Signature**

```ts
export declare const isRefreshBoth: <E, A>(fea: D.Datum<These<E, A>>) => fea is D.Refresh<Both<E, A>>
```

Added in v3.5.0

## isRefreshLeft

**Signature**

```ts
export declare const isRefreshLeft: <E, A>(fea: D.Datum<These<E, A>>) => fea is D.Refresh<Left<E>>
```

Added in v3.5.0

## isRefreshRight

**Signature**

```ts
export declare const isRefreshRight: <E, A>(fea: D.Datum<These<E, A>>) => fea is D.Refresh<Right<A>>
```

Added in v3.5.0

## isReplete

**Signature**

```ts
export declare const isReplete: <A>(ma: D.Datum<A>) => ma is D.Replete<A>
```

Added in v3.5.0

## isRepleteBoth

**Signature**

```ts
export declare const isRepleteBoth: <E, A>(fea: D.Datum<These<E, A>>) => fea is D.Replete<Both<E, A>>
```

Added in v3.5.0

## isRepleteLeft

**Signature**

```ts
export declare const isRepleteLeft: <E, A>(fea: D.Datum<These<E, A>>) => fea is D.Replete<Left<E>>
```

Added in v3.5.0

## isRepleteRight

**Signature**

```ts
export declare const isRepleteRight: <E, A>(fea: D.Datum<These<E, A>>) => fea is D.Replete<Right<A>>
```

Added in v3.5.0

## isSuccess

**Signature**

```ts
export declare const isSuccess: <E, A>(fea: D.Datum<These<E, A>>) => fea is Valued<Right<A>>
```

Added in v3.5.0

## isValued

**Signature**

```ts
export declare const isValued: <A>(ma: D.Datum<A>) => ma is D.Refresh<A> | D.Replete<A>
```

Added in v3.5.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: D.Datum<These<E, A>>) => D.Datum<These<E, B>>
```

Added in v3.5.0

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: D.Datum<These<E, A>>) => D.Datum<These<G, A>>
```

Added in v3.5.0

## partialSuccess

**Signature**

```ts
export declare const partialSuccess: <E = never, A = never>(e: E, a: A) => D.Datum<These<E, A>>
```

Added in v3.5.0

## partialSuccessR

**Signature**

```ts
export declare const partialSuccessR: <E = never, A = never>(e: E, a: A) => D.Datum<These<E, A>>
```

Added in v3.5.0

## pending

**Signature**

```ts
export declare const pending: D.Datum<These<never, never>>
```

Added in v3.5.0

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <E>(fa: D.Datum<These<E, A>>) => B
```

Added in v3.5.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <E>(fa: D.Datum<These<E, A>>) => B
```

Added in v3.5.0

## refreshFold

**Signature**

```ts
export declare const refreshFold: <E, A, B>(
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean | undefined) => B,
  onSuccess: (a: A, r?: boolean | undefined) => B,
  onPartialSuccess: (e: E, a: A, r?: boolean | undefined) => B
) => (fea: D.Datum<These<E, A>>) => B
```

Added in v3.5.0

## squash

**Signature**

```ts
export declare const squash: <E, A, B>(
  onNone: (r?: boolean | undefined) => B,
  onFailure: (e: E, r?: boolean | undefined) => B,
  onSuccess: (a: A, r?: boolean | undefined) => B,
  onPartialSuccess: (e: E, a: A, r?: boolean | undefined) => B
) => (fea: D.Datum<These<E, A>>) => B
```

Added in v3.5.0

## success

**Signature**

```ts
export declare const success: <E = never, A = never>(a: A) => D.Datum<These<E, A>>
```

Added in v3.5.0

## successR

**Signature**

```ts
export declare const successR: <E = never, A = never>(a: A) => D.Datum<These<E, A>>
```

Added in v3.5.0

## toRefresh

**Signature**

```ts
export declare const toRefresh: <E, A>(fea: D.Datum<These<E, A>>) => D.Datum<These<E, A>>
```

Added in v3.5.0

## toReplete

**Signature**

```ts
export declare const toReplete: <E, A>(fea: D.Datum<These<E, A>>) => D.Datum<These<E, A>>
```

Added in v3.5.0
