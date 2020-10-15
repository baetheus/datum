---
title: Datum.ts
nav_order: 1
parent: Modules
---

## Datum overview

Added in v2.0.0

Represents a value of one of four possible types (a disjoint union).

An instance of `Datum` is either an instance of `Initial`, `Pending`, `Refresh` or `Replete`.

A common use of `Datum` is as a container for dealing with refreshable data values. In this usage,
the initial value is `Initial`. `Pending` represents in flight activity. `Refresh` indicates
that data exists but is being refreshed, and `Replete` meands data exists and is not being
refreshed.

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Datum (type alias)](#datum-type-alias)
  - [Initial (interface)](#initial-interface)
  - [Pending (interface)](#pending-interface)
  - [Refresh (interface)](#refresh-interface)
  - [Replete (interface)](#replete-interface)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [alt](#alt)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [chain](#chain)
  - [chainFirst](#chainfirst)
  - [compact](#compact)
  - [constInitial](#constinitial)
  - [constPending](#constpending)
  - [datum](#datum)
  - [duplicate](#duplicate)
  - [elem](#elem)
  - [exists](#exists)
  - [extend](#extend)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [filterOrElse](#filterorelse)
  - [flatten](#flatten)
  - [fold](#fold)
  - [foldMap](#foldmap)
  - [fromEither](#fromeither)
  - [fromNullable](#fromnullable)
  - [fromOption](#fromoption)
  - [fromPredicate](#frompredicate)
  - [getApplyMonoid](#getapplymonoid)
  - [getApplySemigroup](#getapplysemigroup)
  - [getEq](#geteq)
  - [getOrElse](#getorelse)
  - [getOrd](#getord)
  - [getSemigroup](#getsemigroup)
  - [getShow](#getshow)
  - [initial](#initial)
  - [isInitial](#isinitial)
  - [isPending](#ispending)
  - [isRefresh](#isrefresh)
  - [isReplete](#isreplete)
  - [isValued](#isvalued)
  - [map](#map)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
  - [pending](#pending)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
  - [refresh](#refresh)
  - [replete](#replete)
  - [separate](#separate)

---

# utils

## Datum (type alias)

**Signature**

```ts
export type Datum<D> = Initial | Pending | Refresh<D> | Replete<D>
```

Added in v2.0.0

## Initial (interface)

**Signature**

```ts
export interface Initial {
  readonly _tag: 'Initial'
}
```

Added in v2.0.0

## Pending (interface)

**Signature**

```ts
export interface Pending {
  readonly _tag: 'Pending'
}
```

Added in v2.0.0

## Refresh (interface)

**Signature**

```ts
export interface Refresh<D> {
  readonly _tag: 'Refresh'
  readonly value: D
}
```

Added in v2.0.0

## Replete (interface)

**Signature**

```ts
export interface Replete<D> {
  readonly _tag: 'Replete'
  readonly value: D
}
```

Added in v2.0.0

## URI

**Signature**

```ts
export declare const URI: '@nll/datum/Datum'
```

Added in v2.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.0.0

## alt

**Signature**

```ts
export declare const alt: <A>(that: () => Datum<A>) => (fa: Datum<A>) => Datum<A>
```

Added in v2.0.0

## ap

**Signature**

```ts
export declare const ap: <A>(fa: Datum<A>) => <B>(fab: Datum<(a: A) => B>) => Datum<B>
```

Added in v2.0.0

## apFirst

**Signature**

```ts
export declare const apFirst: <B>(fb: Datum<B>) => <A>(fa: Datum<A>) => Datum<A>
```

Added in v2.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <B>(fb: Datum<B>) => <A>(fa: Datum<A>) => Datum<B>
```

Added in v2.0.0

## chain

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => Datum<B>) => (ma: Datum<A>) => Datum<B>
```

Added in v2.0.0

## chainFirst

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => Datum<B>) => (ma: Datum<A>) => Datum<A>
```

Added in v2.0.0

## compact

**Signature**

```ts
export declare const compact: <A>(fa: Datum<Option<A>>) => Datum<A>
```

Added in v2.0.0

## constInitial

**Signature**

```ts
export declare const constInitial: Lazy<Initial>
```

Added in v2.0.0

## constPending

**Signature**

```ts
export declare const constPending: Lazy<Pending>
```

Added in v2.0.0

## datum

**Signature**

```ts
export declare const datum: Monad1<'@nll/datum/Datum'> &
  Foldable1<'@nll/datum/Datum'> &
  Traversable1<'@nll/datum/Datum'> &
  Alternative1<'@nll/datum/Datum'> &
  Extend1<'@nll/datum/Datum'> &
  Compactable1<'@nll/datum/Datum'> &
  Filterable1<'@nll/datum/Datum'> &
  Witherable1<'@nll/datum/Datum'> &
  MonadThrow1<'@nll/datum/Datum'>
```

Added in v2.0.0

## duplicate

**Signature**

```ts
export declare const duplicate: <A>(ma: Datum<A>) => Datum<Datum<A>>
```

Added in v2.0.0

## elem

**Signature**

```ts
export declare const elem: <A>(E: Eq<A>) => <E>(a: A, ma: Datum<A>) => boolean
```

Added in v2.0.0

## exists

Returns `false` if `Refresh` or returns the result of the application of the given predicate to the `Replete` value.

**Signature**

```ts
export declare const exists: <A>(predicate: Predicate<A>) => <E>(ma: Datum<A>) => boolean
```

Added in v2.0.0

## extend

**Signature**

```ts
export declare const extend: <A, B>(f: (fa: Datum<A>) => B) => (ma: Datum<A>) => Datum<B>
```

Added in v2.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <A, B>(refinement: Refinement<A, B>): (fa: Datum<A>) => Datum<B>
  <A>(predicate: Predicate<A>): (fa: Datum<A>) => Datum<A>
}
```

Added in v2.0.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (fa: Datum<A>) => Datum<B>
```

Added in v2.0.0

## filterOrElse

**Signature**

```ts
export declare const filterOrElse: {
  <E, A, B>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: Datum<A>) => Datum<B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: Datum<A>) => Datum<A>
}
```

Added in v2.6.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(mma: Datum<Datum<A>>) => Datum<A>
```

Added in v2.0.0

## fold

**Signature**

```ts
export declare const fold: <A, B>(
  onInitial: () => B,
  onPending: () => B,
  onRefresh: (v: A) => B,
  onReplete: (a: A) => B
) => (ma: Datum<A>) => B
```

Added in v2.0.0

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Datum<A>) => M
```

Added in v2.0.0

## fromEither

**Signature**

```ts
export declare const fromEither: <E, A>(ma: Either<E, A>) => Datum<A>
```

Added in v2.0.0

## fromNullable

Takes a nullable value, if the value is not nully, turn it into a `Replete`, otherwise `Initial`.

**Signature**

```ts
export declare const fromNullable: <A>(a: A) => Datum<A>
```

Added in v2.0.0

## fromOption

**Signature**

```ts
export declare const fromOption: <E>(onNone: () => E) => <A>(ma: Option<A>) => Datum<A>
```

Added in v2.6.0

## fromPredicate

**Signature**

```ts
export declare const fromPredicate: {
  <E, A, B>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => Datum<B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => Datum<A>
}
```

Added in v2.6.0

## getApplyMonoid

**Signature**

```ts
export declare const getApplyMonoid: <A>(M: Monoid<A>) => Monoid<Datum<A>>
```

Added in v2.0.0

## getApplySemigroup

`Apply` semigroup

**Signature**

```ts
export declare const getApplySemigroup: <A>(S: Semigroup<A>) => Semigroup<Datum<A>>
```

Added in v2.0.0

## getEq

**Signature**

```ts
export declare const getEq: <A>(E: Eq<A>) => Eq<Datum<A>>
```

Added in v2.0.0

## getOrElse

**Signature**

```ts
export declare const getOrElse: <A>(onInitial: () => A, onPending: () => A) => (ma: Datum<A>) => A
```

Added in v2.0.0

## getOrd

The `Ord` instance allows `Datum` values to be compared with
`compare`, whenever there is an `Ord` instance for
the type the `Datum` contains.

`Initial` < `Pending` < `Refresh` | `Replete`

**Signature**

```ts
export declare function getOrd<A>(O: Ord<A>): Ord<Datum<A>>
```

Added in v2.0.0

## getSemigroup

Semigroup returning the left-most non-`Initial` and non-`Pending` value. If both operands
are `Replete`s or `Refresh`s then the inner values are appended using the provided
`Semigroup` and refresh is coalesced if either are `Refresh`.

**Signature**

```ts
export declare const getSemigroup: <A>(S: Semigroup<A>) => Semigroup<Datum<A>>
```

Added in v2.0.0

## getShow

**Signature**

```ts
export declare const getShow: <A>(S: Show<A>) => Show<Datum<A>>
```

Added in v2.0.0

## initial

Constructs an initial `Datum` holding no value.

**Signature**

```ts
export declare const initial: Datum<never>
```

Added in v2.0.0

## isInitial

Returns `true` if the Async is an instance of `Initial`, `false` otherwise

**Signature**

```ts
export declare const isInitial: <A>(ma: Datum<A>) => ma is Initial
```

Added in v2.0.0

## isPending

Returns `true` if the Async is an instance of `Pending`, `false` otherwise

**Signature**

```ts
export declare const isPending: <A>(ma: Datum<A>) => ma is Pending
```

Added in v2.0.0

## isRefresh

Returns `true` if the Async is an instance of `Refresh`, `false` otherwise

**Signature**

```ts
export declare const isRefresh: <A>(ma: Datum<A>) => ma is Refresh<A>
```

Added in v2.0.0

## isReplete

Returns `true` if the Async is an instance of `Replete`, `false` otherwise

**Signature**

```ts
export declare const isReplete: <A>(ma: Datum<A>) => ma is Replete<A>
```

Added in v2.0.0

## isValued

**Signature**

```ts
export declare const isValued: <A>(ma: Datum<A>) => ma is Replete<A> | Refresh<A>
```

Added in v2.0.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: Datum<A>) => Datum<B>
```

Added in v2.0.0

## partition

**Signature**

```ts
export declare const partition: {
  <A, B>(refinement: Refinement<A, B>): (fa: Datum<A>) => Separated<Datum<A>, Datum<B>>
  <A>(predicate: Predicate<A>): (fa: Datum<A>) => Separated<Datum<A>, Datum<A>>
}
```

Added in v2.0.0

## partitionMap

**Signature**

```ts
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: Datum<A>) => Separated<Datum<B>, Datum<C>>
```

Added in v2.0.0

## pending

Constructs a pending `Datum` holding no value.

**Signature**

```ts
export declare const pending: Datum<never>
```

Added in v2.0.0

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Datum<A>) => B
```

Added in v2.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Datum<A>) => B
```

Added in v2.0.0

## refresh

Constructs a new refresh `Datum` holding a value.

**Signature**

```ts
export declare const refresh: <A = never>(value: A) => Datum<A>
```

Added in v2.0.0

## replete

Constructs a new replete `Datum` holding a value.

**Signature**

```ts
export declare const replete: <A = never>(value: A) => Datum<A>
```

Added in v2.0.0

## separate

**Signature**

```ts
export declare const separate: <A, B>(fa: Datum<Either<A, B>>) => Separated<Datum<A>, Datum<B>>
```

Added in v2.0.0
