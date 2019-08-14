---
title: Datum.ts
nav_order: 1
parent: Modules
---

# Overview

Represents a value of one of four possible types (a disjoint union).

An instance of `Datum` is either an instance of `Initial`, `Pending`, `Refresh` or `Replete`.

A common use of `Datum` is as a container for dealing with refreshable data values. In this usage,
the initial value is `Initial`. `Pending` represents in flight activity. `Refresh` indicates
that data exists but is being refreshed, and `Replete` meands data exists and is not being
refreshed.

---

<h2 class="text-delta">Table of contents</h2>

- [Initial (interface)](#initial-interface)
- [Pending (interface)](#pending-interface)
- [Refresh (interface)](#refresh-interface)
- [Replete (interface)](#replete-interface)
- [Datum (type alias)](#datum-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI (constant)](#uri-constant)
- [datum (constant)](#datum-constant)
- [initial (constant)](#initial-constant)
- [pending (constant)](#pending-constant)
- [constInitial (function)](#constinitial-function)
- [constPending (function)](#constpending-function)
- [elem (function)](#elem-function)
- [exists (function)](#exists-function)
- [fold (function)](#fold-function)
- [fromNullable (function)](#fromnullable-function)
- [getApplyMonoid (function)](#getapplymonoid-function)
- [getApplySemigroup (function)](#getapplysemigroup-function)
- [getEq (function)](#geteq-function)
- [getOrElse (function)](#getorelse-function)
- [getOrd (function)](#getord-function)
- [getSemigroup (function)](#getsemigroup-function)
- [getShow (function)](#getshow-function)
- [isInitial (function)](#isinitial-function)
- [isPending (function)](#ispending-function)
- [isRefresh (function)](#isrefresh-function)
- [isReplete (function)](#isreplete-function)
- [isValued (function)](#isvalued-function)
- [refresh (function)](#refresh-function)
- [replete (function)](#replete-function)
- [alt (export)](#alt-export)
- [ap (export)](#ap-export)
- [apFirst (export)](#apfirst-export)
- [apSecond (export)](#apsecond-export)
- [chain (export)](#chain-export)
- [chainFirst (export)](#chainfirst-export)
- [compact (export)](#compact-export)
- [duplicate (export)](#duplicate-export)
- [extend (export)](#extend-export)
- [filter (export)](#filter-export)
- [filterMap (export)](#filtermap-export)
- [flatten (export)](#flatten-export)
- [foldMap (export)](#foldmap-export)
- [fromEither (export)](#fromeither-export)
- [map (export)](#map-export)
- [partition (export)](#partition-export)
- [partitionMap (export)](#partitionmap-export)
- [reduce (export)](#reduce-export)
- [reduceRight (export)](#reduceright-export)
- [separate (export)](#separate-export)

---

# Initial (interface)

**Signature**

```ts
export interface Initial {
  readonly _tag: 'Initial'
}
```

Added in v2.0.0

# Pending (interface)

**Signature**

```ts
export interface Pending {
  readonly _tag: 'Pending'
}
```

Added in v2.0.0

# Refresh (interface)

**Signature**

```ts
export interface Refresh<D> {
  readonly _tag: 'Refresh'
  readonly value: D
}
```

Added in v2.0.0

# Replete (interface)

**Signature**

```ts
export interface Replete<D> {
  readonly _tag: 'Replete'
  readonly value: D
}
```

Added in v2.0.0

# Datum (type alias)

**Signature**

```ts
export type Datum<D> = Initial | Pending | Refresh<D> | Replete<D>
```

Added in v2.0.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.0.0

# URI (constant)

**Signature**

```ts
export const URI: "@nll/async-data/datum" = ...
```

Added in v2.0.0

# datum (constant)

**Signature**

```ts
export const datum: Monad1<URI> &
  Foldable1<URI> &
  Traversable1<URI> &
  Alternative1<URI> &
  Extend1<URI> &
  Compactable1<URI> &
  Filterable1<URI> &
  Witherable1<URI> &
  MonadThrow1<URI> = ...
```

Added in v2.0.0

# initial (constant)

Constructs an initial `Datum` holding no value.

**Signature**

```ts
export const initial: Datum<never> = ...
```

Added in v2.0.0

# pending (constant)

Constructs a pending `Datum` holding no value.

**Signature**

```ts
export const pending: Datum<never> = ...
```

Added in v2.0.0

# constInitial (function)

**Signature**

```ts
export const constInitial = () => ...
```

Added in v2.0.0

# constPending (function)

**Signature**

```ts
export const constPending = () => ...
```

Added in v2.0.0

# elem (function)

**Signature**

```ts
export const elem = <A>(E: Eq<A>) => <E>(a: A, ma: Datum<A>): boolean =>
  fold<A, boolean>(
    constFalse,
    constFalse,
    b => E.equals(a, b),
    b => ...
```

Added in v2.0.0

# exists (function)

Returns `false` if `Refresh` or returns the result of the application of the given predicate to the `Replete` value.

**Signature**

```ts
export const exists = <A>(predicate: Predicate<A>) => <E>(
  ma: Datum<A>
): boolean => ...
```

Added in v2.0.0

# fold (function)

**Signature**

```ts
export const fold = <A, B>(
  onInitial: () => B,
  onPending: () => B,
  onRefresh: (v: A) => B,
  onReplete: (a: A) => B
) => (ma: Datum<A>): B => ...
```

Added in v2.0.0

# fromNullable (function)

Takes a nullable value, if the value is not nully, turn it into a `Replete`, otherwise `Initial`.

**Signature**

```ts
export const fromNullable = <A>(a: A | null | undefined): Datum<A> => ...
```

Added in v2.0.0

# getApplyMonoid (function)

**Signature**

```ts
export const getApplyMonoid = <A>(M: Monoid<A>): Monoid<Datum<A>> => ...
```

Added in v2.0.0

# getApplySemigroup (function)

`Apply` semigroup

**Signature**

```ts
export const getApplySemigroup = <A>(S: Semigroup<A>): Semigroup<Datum<A>> => ...
```

Added in v2.0.0

# getEq (function)

**Signature**

```ts
export const getEq = <A>(E: Eq<A>): Eq<Datum<A>> => ({
  equals: (x, y) => ...
```

Added in v2.0.0

# getOrElse (function)

**Signature**

```ts
export const getOrElse = <A>(onInitial: () => A, onPending: () => A) => (
  ma: Datum<A>
): A => ...
```

Added in v2.0.0

# getOrd (function)

The `Ord` instance allows `Datum` values to be compared with
`compare`, whenever there is an `Ord` instance for
the type the `Datum` contains.

`Initial` < `Pending` < `Refresh` | `Replete`

**Signature**

```ts
export function getOrd<A>(O: Ord<A>): Ord<Datum<A>> { ... }
```

Added in v2.0.0

# getSemigroup (function)

Semigroup returning the left-most non-`Initial` and non-`Pending` value. If both operands
are `Replete`s or `Refresh`s then the inner values are appended using the provided
`Semigroup` and refresh is coalesced if either are `Refresh`.

**Signature**

```ts
export const getSemigroup = <A>(S: Semigroup<A>): Semigroup<Datum<A>> => ({
  concat: (x, y) => ...
```

Added in v2.0.0

# getShow (function)

**Signature**

```ts
export const getShow = <A>(S: Show<A>): Show<Datum<A>> => ({
  show: ma => ...
```

Added in v2.0.0

# isInitial (function)

Returns `true` if the Async is an instance of `Initial`, `false` otherwise

**Signature**

```ts
export const isInitial = <A>(ma: Datum<A>): ma is Initial => ...
```

Added in v2.0.0

# isPending (function)

Returns `true` if the Async is an instance of `Pending`, `false` otherwise

**Signature**

```ts
export const isPending = <A>(ma: Datum<A>): ma is Pending => ...
```

Added in v2.0.0

# isRefresh (function)

Returns `true` if the Async is an instance of `Refresh`, `false` otherwise

**Signature**

```ts
export const isRefresh = <A>(ma: Datum<A>): ma is Refresh<A> => ...
```

Added in v2.0.0

# isReplete (function)

Returns `true` if the Async is an instance of `Replete`, `false` otherwise

**Signature**

```ts
export const isReplete = <A>(ma: Datum<A>): ma is Replete<A> => ...
```

Added in v2.0.0

# isValued (function)

**Signature**

```ts
export const isValued = <A>(ma: Datum<A>): ma is Replete<A> | Refresh<A> => ...
```

Added in v2.0.0

# refresh (function)

Constructs a new refresh `Datum` holding a value.

**Signature**

```ts
export const refresh = <A = never>(value: A): Datum<A> => ...
```

Added in v2.0.0

# replete (function)

Constructs a new replete `Datum` holding a value.

**Signature**

```ts
export const replete = <A = never>(value: A): Datum<A> => ...
```

Added in v2.0.0

# alt (export)

**Signature**

```ts
<A>(that: () => Datum<A>) => (fa: Datum<A>) => Datum<A>
```

Added in v2.0.0

# ap (export)

**Signature**

```ts
<A>(fa: Datum<A>) => <B>(fab: Datum<(a: A) => B>) => Datum<B>
```

Added in v2.0.0

# apFirst (export)

**Signature**

```ts
<B>(fb: Datum<B>) => <A>(fa: Datum<A>) => Datum<A>
```

Added in v2.0.0

# apSecond (export)

**Signature**

```ts
<B>(fb: Datum<B>) => <A>(fa: Datum<A>) => Datum<B>
```

Added in v2.0.0

# chain (export)

**Signature**

```ts
<A, B>(f: (a: A) => Datum<B>) => (ma: Datum<A>) => Datum<B>
```

Added in v2.0.0

# chainFirst (export)

**Signature**

```ts
<A, B>(f: (a: A) => Datum<B>) => (ma: Datum<A>) => Datum<A>
```

Added in v2.0.0

# compact (export)

**Signature**

```ts
<A>(fa: Datum<Option<A>>) => Datum<A>
```

Added in v2.0.0

# duplicate (export)

**Signature**

```ts
<A>(ma: Datum<A>) => Datum<Datum<A>>
```

Added in v2.0.0

# extend (export)

**Signature**

```ts
<A, B>(f: (fa: Datum<A>) => B) => (ma: Datum<A>) => Datum<B>
```

Added in v2.0.0

# filter (export)

**Signature**

```ts
{ <A, B>(refinement: Refinement<A, B>): (fa: Datum<A>) => Datum<B>; <A>(predicate: Predicate<A>): (fa: Datum<A>) => Datum<A>; }
```

Added in v2.0.0

# filterMap (export)

**Signature**

```ts
<A, B>(f: (a: A) => Option<B>) => (fa: Datum<A>) => Datum<B>
```

Added in v2.0.0

# flatten (export)

**Signature**

```ts
<A>(mma: Datum<Datum<A>>) => Datum<A>
```

Added in v2.0.0

# foldMap (export)

**Signature**

```ts
;<M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Datum<A>) => M
```

Added in v2.0.0

# fromEither (export)

**Signature**

```ts
<E, A>(ma: Either<E, A>) => Datum<A>
```

Added in v2.0.0

# map (export)

**Signature**

```ts
<A, B>(f: (a: A) => B) => (fa: Datum<A>) => Datum<B>
```

Added in v2.0.0

# partition (export)

**Signature**

```ts
{ <A, B>(refinement: Refinement<A, B>): (fa: Datum<A>) => Separated<Datum<A>, Datum<B>>; <A>(predicate: Predicate<A>): (fa: Datum<A>) => Separated<Datum<A>, Datum<A>>; }
```

Added in v2.0.0

# partitionMap (export)

**Signature**

```ts
<A, B, C>(f: (a: A) => Either<B, C>) => (fa: Datum<A>) => Separated<Datum<B>, Datum<C>>
```

Added in v2.0.0

# reduce (export)

**Signature**

```ts
;<A, B>(b: B, f: (b: B, a: A) => B) => (fa: Datum<A>) => B
```

Added in v2.0.0

# reduceRight (export)

**Signature**

```ts
;<A, B>(b: B, f: (a: A, b: B) => B) => (fa: Datum<A>) => B
```

Added in v2.0.0

# separate (export)

**Signature**

```ts
<A, B>(fa: Datum<Either<A, B>>) => Separated<Datum<A>, Datum<B>>
```

Added in v2.0.0
