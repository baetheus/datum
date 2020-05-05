---
title: DatumEither.ts
nav_order: 2
parent: Modules
---

# DatumEither overview

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

- [DatumEither (type alias)](#datumeither-type-alias)
- [Failure (type alias)](#failure-type-alias)
- [Success (type alias)](#success-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [alt](#alt)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [bimap](#bimap)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [constInitial](#constinitial)
- [constPending](#constpending)
- [datumEither](#datumeither)
- [failure](#failure)
- [flatten](#flatten)
- [fold](#fold)
- [fromEither](#fromeither)
- [fromNullable](#fromnullable)
- [fromOption](#fromoption)
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
- [refreshFold](#refreshfold)
- [squash](#squash)
- [success](#success)
- [toRefresh](#torefresh)
- [toReplete](#toreplete)

---

# DatumEither (type alias)

**Signature**

```ts
export type DatumEither<E, A> = Datum<Either<E, A>>
```

Added in v2.1.0

# Failure (type alias)

**Signature**

```ts
export type Failure<E> = Replete<Left<E>> | Refresh<Left<E>>
```

Added in v2.3.0

# Success (type alias)

**Signature**

```ts
export type Success<A> = Replete<Right<A>> | Refresh<Right<A>>
```

Added in v2.3.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.0.0

# URI

**Signature**

```ts
export declare const URI: '@nll/datum/DatumEither'
```

Added in v2.0.0

# alt

**Signature**

```ts
export declare const alt: <E, A>(that: () => Datum<Either<E, A>>) => (fa: Datum<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.0.0

# ap

**Signature**

```ts
export declare const ap: <E, A>(
  fa: Datum<Either<E, A>>
) => <B>(fab: Datum<Either<E, (a: A) => B>>) => Datum<Either<E, B>>
```

Added in v2.0.0

# apFirst

**Signature**

```ts
export declare const apFirst: <E, B>(fb: Datum<Either<E, B>>) => <A>(fa: Datum<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.0.0

# apSecond

**Signature**

```ts
export declare const apSecond: <E, B>(fb: Datum<Either<E, B>>) => <A>(fa: Datum<Either<E, A>>) => Datum<Either<E, B>>
```

Added in v2.0.0

# bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (fa: Datum<Either<E, A>>) => Datum<Either<G, B>>
```

Added in v2.0.0

# chain

**Signature**

```ts
export declare const chain: <E, A, B>(
  f: (a: A) => Datum<Either<E, B>>
) => (ma: Datum<Either<E, A>>) => Datum<Either<E, B>>
```

Added in v2.0.0

# chainFirst

**Signature**

```ts
export declare const chainFirst: <E, A, B>(
  f: (a: A) => Datum<Either<E, B>>
) => (ma: Datum<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.0.0

# constInitial

**Signature**

```ts
export declare const constInitial: <E, D>() => Datum<Either<E, D>>
```

Added in v2.4.1

# constPending

**Signature**

```ts
export declare const constPending: <E, D>() => Datum<Either<E, D>>
```

Added in v2.4.1

# datumEither

**Signature**

```ts
export declare const datumEither: Monad2<'@nll/datum/DatumEither'> & EitherM1<'@nll/datum/Datum'>
```

Added in v2.0.0

# failure

**Signature**

```ts
export declare const failure: <E>(e: E) => Datum<Either<E, never>>
```

Added in v2.1.0

# flatten

**Signature**

```ts
export declare const flatten: <E, A>(mma: Datum<Either<E, Datum<Either<E, A>>>>) => Datum<Either<E, A>>
```

Added in v2.0.0

# fold

**Signature**

```ts
export declare const fold: <E, A, B>(
  onInitial: Lazy<B>,
  onPending: Lazy<B>,
  onRefreshLeft: FunctionN<[E], B>,
  onRefreshRight: FunctionN<[A], B>,
  onRepleteLeft: FunctionN<[E], B>,
  onRepleteRight: FunctionN<[A], B>
) => (fea: Datum<Either<E, A>>) => B
```

Added in v2.7.0

# fromEither

**Signature**

```ts
export declare const fromEither: <E, A>(e: Lazy<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.2.0

# fromNullable

Takes a nullable value, if the value is not nully, turn it into a `Success<A>`, otherwise `Initial`.

**Signature**

```ts
export declare const fromNullable: <E, A>(a: A) => Datum<Either<E, A>>
```

Added in v2.4.0

# fromOption

**Signature**

```ts
export declare const fromOption: <E, A>(onNone: Lazy<E>) => (o: Option<A>) => Datum<Either<unknown, A>>
```

Added in v2.2.0

# initial

**Signature**

```ts
export declare const initial: Datum<Either<never, never>>
```

Added in v2.4.1

# isFailure

**Signature**

```ts
export declare const isFailure: <E, A>(fea: Datum<Either<E, A>>) => fea is Failure<E>
```

Added in v2.1.0

# isInitial

**Signature**

```ts
export declare const isInitial: <A>(ma: Datum<A>) => ma is Initial
```

Added in v2.7.0

# isPending

**Signature**

```ts
export declare const isPending: <A>(ma: Datum<A>) => ma is Pending
```

Added in v2.7.0

# isRefresh

**Signature**

```ts
export declare const isRefresh: <A>(ma: Datum<A>) => ma is Refresh<A>
```

Added in v2.7.0

# isRefreshLeft

**Signature**

```ts
export declare const isRefreshLeft: <E, A>(fea: Datum<Either<E, A>>) => fea is Refresh<Left<E>>
```

Added in v2.7.0

# isRefreshRight

**Signature**

```ts
export declare const isRefreshRight: <E, A>(fea: Datum<Either<E, A>>) => fea is Refresh<Right<A>>
```

Added in v2.7.0

# isReplete

**Signature**

```ts
export declare const isReplete: <A>(ma: Datum<A>) => ma is Replete<A>
```

Added in v2.7.0

# isRepleteLeft

**Signature**

```ts
export declare const isRepleteLeft: <E, A>(fea: Datum<Either<E, A>>) => fea is Replete<Left<E>>
```

Added in v2.7.0

# isRepleteRight

**Signature**

```ts
export declare const isRepleteRight: <E, A>(fea: Datum<Either<E, A>>) => fea is Replete<Right<A>>
```

Added in v2.7.0

# isSuccess

**Signature**

```ts
export declare const isSuccess: <E, A>(fea: Datum<Either<E, A>>) => fea is Success<A>
```

Added in v2.1.0

# isValued

**Signature**

```ts
export declare const isValued: <A>(ma: Datum<A>) => ma is Replete<A> | Refresh<A>
```

Added in v2.7.0

# map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Datum<Either<E, A>>) => Datum<Either<E, B>>
```

Added in v2.0.0

# mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: Datum<Either<E, A>>) => Datum<Either<G, A>>
```

Added in v2.0.0

# pending

**Signature**

```ts
export declare const pending: Datum<Either<never, never>>
```

Added in v2.4.1

# refreshFold

**Signature**

```ts
export declare const refreshFold: <E, A, B>(
  onInitial: () => B,
  onPending: () => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: Datum<Either<E, A>>) => B
```

Added in v2.1.0

# squash

**Signature**

```ts
export declare const squash: <E, A, B>(
  onNone: (r?: boolean) => B,
  onFailure: (e: E, r?: boolean) => B,
  onSuccess: (a: A, r?: boolean) => B
) => (fea: Datum<Either<E, A>>) => B
```

Added in v2.3.0

# success

**Signature**

```ts
export declare const success: <A>(a: A) => Datum<Either<never, A>>
```

Added in v2.1.0

# toRefresh

**Signature**

```ts
export declare const toRefresh: <E, A>(fea: Datum<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.1.0

# toReplete

**Signature**

```ts
export declare const toReplete: <E, A>(fea: Datum<Either<E, A>>) => Datum<Either<E, A>>
```

Added in v2.7.0
