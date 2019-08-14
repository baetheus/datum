---
title: DatumEither.ts
nav_order: 2
parent: Modules
---

# Overview

Represents a value of one of six possible types (a disjoint union).

An instance of `DatumEither` is equivalent to `Datum<Either<E, A>>`

A common use of `DatumEither` is as a container for dealing with refreshable data values that
can have error conditions. The full type list is:

`Initial`
`Pending`
`Refresh<Either<E, A>>`
`Refresh<Left<E>>`
`Refresh<Right<A>>`
`Replete<Either<E, A>>`
`Replete<Left<E>>`
`Replete<Right<A>>`

There are additional helper methods for going from refresh to replete and back.

---

<h2 class="text-delta">Table of contents</h2>

- [DatumEither (type alias)](#datumeither-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI (constant)](#uri-constant)
- [datumEither (constant)](#datumeither-constant)
- [failure (function)](#failure-function)
- [isFailure (function)](#isfailure-function)
- [isSuccess (function)](#issuccess-function)
- [refreshFold (function)](#refreshfold-function)
- [refreshFoldR (function)](#refreshfoldr-function)
- [success (function)](#success-function)
- [toRefresh (function)](#torefresh-function)
- [alt (export)](#alt-export)
- [ap (export)](#ap-export)
- [apFirst (export)](#apfirst-export)
- [apSecond (export)](#apsecond-export)
- [bimap (export)](#bimap-export)
- [chain (export)](#chain-export)
- [chainFirst (export)](#chainfirst-export)
- [flatten (export)](#flatten-export)
- [map (export)](#map-export)
- [mapLeft (export)](#mapleft-export)

---

# DatumEither (type alias)

**Signature**

```ts
export type DatumEither<E, A> = Datum<Either<E, A>>
```

Added in v2.1.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.0.0

# URI (constant)

**Signature**

```ts
export const URI: "@nll/async-data/datum-either" = ...
```

Added in v2.0.0

# datumEither (constant)

**Signature**

```ts
export const datumEither: Monad2<URI> & EitherM1<DatumURI> = ...
```

Added in v2.0.0

# failure (function)

**Signature**

```ts
export const failure = <E>(e: E) => ...
```

Added in v2.1.0

# isFailure (function)

**Signature**

```ts
export const isFailure = <E, A>(
  fea: DatumEither<E, A>
): fea is Replete<Left<E>> => ...
```

Added in v2.1.0

# isSuccess (function)

**Signature**

```ts
export const isSuccess = <E, A>(
  fea: DatumEither<E, A>
): fea is Replete<Right<A>> => ...
```

Added in v2.1.0

# refreshFold (function)

**Signature**

```ts
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
    e => ...
```

Added in v2.1.0

# refreshFoldR (function)

**Signature**

```ts
export const refreshFoldR = <E, A, B>(
  fea: DatumEither<E, A>,
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
): B => ...
```

Added in v2.1.0

# success (function)

**Signature**

```ts
export const success = <A>(a: A) => ...
```

Added in v2.1.0

# toRefresh (function)

**Signature**

```ts
export const toRefresh = <E, A>(fea: DatumEither<E, A>): DatumEither<E, A> =>
  fold<Either<E, A>, DatumEither<E, A>>(
    constPending,
    constPending,
    () => fea,
    a => ...
```

Added in v2.1.0

# alt (export)

**Signature**

```ts
<E, A>(that: () => Datum<Either<E, A>>) => (fa: Datum<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.0.0

# ap (export)

**Signature**

```ts
<E, A>(fa: Datum<Either<E, A>>) => <B>(fab: Datum<Either<E, (a: A) => B>>) => Datum<Either<E, B>>
```

Added in v2.0.0

# apFirst (export)

**Signature**

```ts
<E, B>(fb: Datum<Either<E, B>>) => <A>(fa: Datum<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.0.0

# apSecond (export)

**Signature**

```ts
<E, B>(fb: Datum<Either<E, B>>) => <A>(fa: Datum<Either<E, A>>) => Datum<Either<E, B>>
```

Added in v2.0.0

# bimap (export)

**Signature**

```ts
<E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: Datum<Either<E, A>>) => Datum<Either<G, B>>
```

Added in v2.0.0

# chain (export)

**Signature**

```ts
<E, A, B>(f: (a: A) => Datum<Either<E, B>>) => (ma: Datum<Either<E, A>>) => Datum<Either<E, B>>
```

Added in v2.0.0

# chainFirst (export)

**Signature**

```ts
<E, A, B>(f: (a: A) => Datum<Either<E, B>>) => (ma: Datum<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.0.0

# flatten (export)

**Signature**

```ts
<E, A>(mma: Datum<Either<E, Datum<Either<E, A>>>>) => Datum<Either<E, A>>
```

Added in v2.0.0

# map (export)

**Signature**

```ts
<A, B>(f: (a: A) => B) => <E>(fa: Datum<Either<E, A>>) => Datum<Either<E, B>>
```

Added in v2.0.0

# mapLeft (export)

**Signature**

```ts
<E, G>(f: (e: E) => G) => <A>(fa: Datum<Either<E, A>>) => Datum<Either<G, A>>
```

Added in v2.0.0
