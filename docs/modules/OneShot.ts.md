---
title: OneShot.ts
nav_order: 5
parent: Modules
---

## OneShot overview

Added in v3.3.0

Represents a value of one of three possible types (a disjoint union).

An instance of `OneShot` is either an instance of `Initial`, `Pending`, or `Complete`.
In effect it is a non-refreshable Datum.

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Complete (interface)](#complete-interface)
  - [Initial (interface)](#initial-interface)
  - [OneShot](#oneshot)
  - [OneShot (type alias)](#oneshot-type-alias)
  - [Pending (interface)](#pending-interface)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [alt](#alt)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [chain](#chain)
  - [chainFirst](#chainfirst)
  - [compact](#compact)
  - [complete](#complete)
  - [constInitial](#constinitial)
  - [constPending](#constpending)
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
  - [isComplete](#iscomplete)
  - [isInitial](#isinitial)
  - [isPending](#ispending)
  - [map](#map)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
  - [pending](#pending)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
  - [separate](#separate)

---

# utils

## Complete (interface)

**Signature**

```ts
export interface Complete<D> {
  readonly _tag: 'Complete'
  readonly value: D
}
```

Added in v3.3.0

## Initial (interface)

**Signature**

```ts
export interface Initial {
  readonly _tag: 'Initial'
}
```

Added in v3.3.0

## OneShot

**Signature**

```ts
export declare const OneShot: Monad1<'@nll/datum/OneShot'> &
  Foldable1<'@nll/datum/OneShot'> &
  Traversable1<'@nll/datum/OneShot'> &
  Alternative1<'@nll/datum/OneShot'> &
  Extend1<'@nll/datum/OneShot'> &
  Compactable1<'@nll/datum/OneShot'> &
  Filterable1<'@nll/datum/OneShot'> &
  Witherable1<'@nll/datum/OneShot'> &
  MonadThrow1<'@nll/datum/OneShot'>
```

Added in v3.3.0

## OneShot (type alias)

**Signature**

```ts
export type OneShot<D> = Initial | Pending | Complete<D>
```

Added in v3.3.0

## Pending (interface)

**Signature**

```ts
export interface Pending {
  readonly _tag: 'Pending'
}
```

Added in v3.3.0

## URI

**Signature**

```ts
export declare const URI: '@nll/datum/OneShot'
```

Added in v3.3.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v3.3.0

## alt

**Signature**

```ts
export declare const alt: <A>(that: Lazy<OneShot<A>>) => (fa: OneShot<A>) => OneShot<A>
```

Added in v3.3.0

## ap

**Signature**

```ts
export declare const ap: <A>(fa: OneShot<A>) => <B>(fab: OneShot<(a: A) => B>) => OneShot<B>
```

Added in v3.3.0

## apFirst

**Signature**

```ts
export declare const apFirst: <B>(fb: OneShot<B>) => <A>(fa: OneShot<A>) => OneShot<A>
```

Added in v3.3.0

## apSecond

**Signature**

```ts
export declare const apSecond: <B>(fb: OneShot<B>) => <A>(fa: OneShot<A>) => OneShot<B>
```

Added in v3.3.0

## chain

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => OneShot<B>) => (ma: OneShot<A>) => OneShot<B>
```

Added in v3.3.0

## chainFirst

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => OneShot<B>) => (ma: OneShot<A>) => OneShot<A>
```

Added in v3.3.0

## compact

**Signature**

```ts
export declare const compact: <A>(fa: OneShot<Option<A>>) => OneShot<A>
```

Added in v3.3.0

## complete

Constructs a new Complete `OneShot` holding a value.

**Signature**

```ts
export declare const complete: <A = never>(value: A) => OneShot<A>
```

Added in v3.3.0

## constInitial

**Signature**

```ts
export declare const constInitial: Lazy<Initial>
```

Added in v3.3.0

## constPending

**Signature**

```ts
export declare const constPending: Lazy<Pending>
```

Added in v3.3.0

## duplicate

**Signature**

```ts
export declare const duplicate: <A>(wa: OneShot<A>) => OneShot<OneShot<A>>
```

Added in v3.3.0

## elem

**Signature**

```ts
export declare const elem: <A>(E: Eq<A>) => <E>(a: A, ma: OneShot<A>) => boolean
```

Added in v3.3.0

## exists

Returns `false` if `Refresh` or returns the result of the application of the given predicate to the `Complete` value.

**Signature**

```ts
export declare const exists: <A>(predicate: Predicate<A>) => <E>(ma: OneShot<A>) => boolean
```

Added in v3.3.0

## extend

**Signature**

```ts
export declare const extend: <A, B>(f: (wa: OneShot<A>) => B) => (wa: OneShot<A>) => OneShot<B>
```

Added in v3.3.0

## filter

**Signature**

```ts
export declare const filter: {
  <A, B>(refinement: Refinement<A, B>): (fa: OneShot<A>) => OneShot<B>
  <A>(predicate: Predicate<A>): (fa: OneShot<A>) => OneShot<A>
}
```

Added in v3.3.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (fa: OneShot<A>) => OneShot<B>
```

Added in v3.3.0

## filterOrElse

**Signature**

```ts
export declare const filterOrElse: {
  <E, A, B>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: OneShot<A>) => OneShot<B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: OneShot<A>) => OneShot<A>
}
```

Added in v3.3.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(mma: OneShot<OneShot<A>>) => OneShot<A>
```

Added in v3.3.0

## fold

**Signature**

```ts
export declare const fold: <A, B>(
  onInitial: () => B,
  onPending: () => B,
  onComplete: (a: A) => B
) => (ma: OneShot<A>) => B
```

Added in v3.3.0

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: OneShot<A>) => M
```

Added in v3.3.0

## fromEither

**Signature**

```ts
export declare const fromEither: <E, A>(ma: Either<E, A>) => OneShot<A>
```

Added in v3.3.0

## fromNullable

Takes a nullable value, if the value is not nully, turn it into a `Complete`, otherwise `Initial`.

**Signature**

```ts
export declare const fromNullable: <A>(a: A | null | undefined) => OneShot<A>
```

Added in v3.3.0

## fromOption

**Signature**

```ts
export declare const fromOption: <E>(onNone: Lazy<E>) => <A>(ma: Option<A>) => OneShot<A>
```

Added in v3.3.0

## fromPredicate

**Signature**

```ts
export declare const fromPredicate: {
  <E, A, B>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => OneShot<B>
  <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => OneShot<A>
}
```

Added in v3.3.0

## getApplyMonoid

**Signature**

```ts
export declare const getApplyMonoid: <A>(M: Monoid<A>) => Monoid<OneShot<A>>
```

Added in v3.3.0

## getApplySemigroup

`Apply` semigroup

**Signature**

```ts
export declare const getApplySemigroup: <A>(S: Semigroup<A>) => Semigroup<OneShot<A>>
```

Added in v3.3.0

## getEq

**Signature**

```ts
export declare const getEq: <A>(E: Eq<A>) => Eq<OneShot<A>>
```

Added in v3.3.0

## getOrElse

**Signature**

```ts
export declare const getOrElse: <A>(onInitial: () => A, onPending: () => A) => (ma: OneShot<A>) => A
```

Added in v3.3.0

## getOrd

The `Ord` instance allows `OneShot` values to be compared with
`compare`, whenever there is an `Ord` instance for
the type the `OneShot` contains.

`Initial` < `Pending` < `Refresh` | `Complete`

**Signature**

```ts
export declare function getOrd<A>(O: Ord<A>): Ord<OneShot<A>>
```

Added in v3.3.0

## getSemigroup

Semigroup returning the left-most non-`Initial` and non-`Pending` value. If both operands
are `Complete`s then the inner values are appended using the provided
`Semigroup`

**Signature**

```ts
export declare const getSemigroup: <A>(S: Semigroup<A>) => Semigroup<OneShot<A>>
```

Added in v3.3.0

## getShow

**Signature**

```ts
export declare const getShow: <A>(S: Show<A>) => Show<OneShot<A>>
```

Added in v3.3.0

## initial

Constructs an initial `OneShot` holding no value.

**Signature**

```ts
export declare const initial: OneShot<never>
```

Added in v3.3.0

## isComplete

Returns `true` if the Async is an instance of `Complete`, `false` otherwise

**Signature**

```ts
export declare const isComplete: <A>(ma: OneShot<A>) => ma is Complete<A>
```

Added in v3.3.0

## isInitial

Returns `true` if the Async is an instance of `Initial`, `false` otherwise

**Signature**

```ts
export declare const isInitial: <A>(ma: OneShot<A>) => ma is Initial
```

Added in v3.3.0

## isPending

Returns `true` if the Async is an instance of `Pending`, `false` otherwise

**Signature**

```ts
export declare const isPending: <A>(ma: OneShot<A>) => ma is Pending
```

Added in v3.3.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: OneShot<A>) => OneShot<B>
```

Added in v3.3.0

## partition

**Signature**

```ts
export declare const partition: {
  <A, B>(refinement: Refinement<A, B>): (fa: OneShot<A>) => Separated<OneShot<A>, OneShot<B>>
  <A>(predicate: Predicate<A>): (fa: OneShot<A>) => Separated<OneShot<A>, OneShot<A>>
}
```

Added in v3.3.0

## partitionMap

**Signature**

```ts
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: OneShot<A>) => Separated<OneShot<B>, OneShot<C>>
```

Added in v3.3.0

## pending

Constructs a pending `OneShot` holding no value.

**Signature**

```ts
export declare const pending: OneShot<never>
```

Added in v3.3.0

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: OneShot<A>) => B
```

Added in v3.3.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: OneShot<A>) => B
```

Added in v3.3.0

## separate

**Signature**

```ts
export declare const separate: <A, B>(fa: OneShot<Either<A, B>>) => Separated<OneShot<A>, OneShot<B>>
```

Added in v3.3.0
