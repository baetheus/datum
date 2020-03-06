---
title: Introduction
permalink: /
nav_order: 1
has_children: false
has_toc: false
---

# @nll/datum is an algebraic data type that represents a value that may or may not exist across time.

`@nll/datum` is a TypeScript native library that provides an [fp-ts](https://github.com/gcanti/fp-ts) based data type for refreshable data that can error.
{: .fs-6 .fw-300 }

## Core Concepts

@nll/datum takes the ideas outlined in the [flow](https://medium.com/@gcanti/slaying-a-ui-antipattern-with-flow-5eed0cfb627b) type and abstracts them in a slightly different way.

### The Datum Type

Where the flow type represents an HTTP request as a type with four states:

- we haven’t asked yet
- we’ve asked, but we haven’t got a response yet
- we got a response, but it was an error
- we got a response, and it was the data we wanted

@nll/datum breaks the problem into smaller parts. Specifically, it looks at remote data as a cross between the **temporal** state, the **existence** of the data, and the **error** state.

The **temporal** has two states:

- not getting data
- getting data

The **existence** has two states as well:

- data doesn't exist
- data exists

The **error** state is actually a substate of **existence** since an error is data too! This means that the error state can be wrapped in a type that handles **time** and **existence** later, depending on how we want to handle errors (for example, by using the [Either](https://gcanti.github.io/fp-ts/modules/Either.ts.html) adt).

Thus, the first real data type we define has the following states (with some new names):

- Initial : **not getting data** and **data doesn't exist**
- Pending : **getting data** and **data doesn't exist**
- Replete : **not getting data** and **data does exist**
- Refresh : **getting data** and **data does exist**

These four states allow the [Datum](./modules/Datum.ts.html) type to handle cases where we are refreshing data that we already have. This is pretty useful in front end applications.

Next, we define a way (not the only way) to handle errors using Datum.

### The DatumEither type

If you've evern used fp-ts before you may have run across types like [TaskEither](https://gcanti.github.io/fp-ts/modules/TaskEither.ts.html), [IOEither](https://gcanti.github.io/fp-ts/modules/IOEither.ts.html), or [ReaderEither](https://gcanti.github.io/fp-ts/modules/ReaderEither.ts.html). These types generally take something that can **error** and wrap it another type. For example, TaskEither and IOEither represent asynchronous and synchronous computation that **can fail**. ReaderEither represents (roughly) a dependency injection that **can fail**.

It should be no surprise that the **temporal** **existence** of data that **can fail** uses the Either adt too. Thus, we arrive at [DatumEither](./modules/DatumEither.ts.html).

Since the **Initial** and **Pending** states have no data, they remain unchanged. The Refresh and Replete states, however, have an Either as their data. So the new state tree looks like:

- Initial : **not getting data** and **data doesn't exist**
- Pending : **getting data** and **data doesn't exist**
- Replete : **not getting data** and **data does exist** which is one of:
  - RepleteLeft : **not getting data** and **data is an error**
  - RepleteRight : **not getting data** and **data is good**
- Refresh : **getting data** and **data does exist** which is one of:
  - RefreshLeft : **getting data** and **data is an error**
  - RefreshRight : **getting data** and **data is good**

The total number of states that DatumEither represents is six to flow's four. However, with the added flexibility of DatumEither, refreshing data can now be represented.

### The Future

Either isn't the only type capable of representing errors. Occasionally, computations can partially fail. For these cases, Datum will eventually also wrap the [These](https://gcanti.github.io/fp-ts/modules/These.ts.html) adt.
