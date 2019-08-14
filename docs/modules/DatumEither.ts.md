---
title: DatumEither.ts
nav_order: 2
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [URI (type alias)](#uri-type-alias)
- [URI (constant)](#uri-constant)
- [datumEither (constant)](#datumeither-constant)
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
