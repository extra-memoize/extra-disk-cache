# @extra-memoize/extra-disk-cache
The adapter for [extra-disk-cache].

[extra-disk-cache]: https://www.npmjs.com/package/extra-disk-cache

## Install
```sh
npm install --save @extra-memoize/extra-disk-cache
# or
yarn add @extra-memoize/extra-disk-cache
```

### API
#### AsyncDiskCache
```ts
class AsyncDiskCache<T> implements IAsyncCache<T> {
  constructor(
    cache: DiskCache
  , toBuffer?: (value: T) => Buffer
  , fromBuffer?: (buffer: Buffer) => T
  )
}
```

#### StaleWhileRevalidateAsyncDiskCache
```ts
class StaleWhileRevalidateAsyncDiskCache<T> implements IStaleWhileRevalidateAsyncCache<T> {
  constructor(
    cache: DiskCache
  , timeToLive: number
  , staleWhileRevalidate: number
  , toBuffer?: (value: T) => Buffer
  , fromBuffer?: (buffer: Buffer) => T
  )
}
```

#### StaleIfErrorAsyncDiskCache
```ts
class StaleIfErrorAsyncDiskCache<T> implements IStaleIfErrorAsyncCache<T> {
  constructor(
    cache: DiskCache
  , timeToLive: number
  , staleIfError: number
  , toBuffer?: (value: T) => Buffer
  , fromBuffer?: (buffer: Buffer) => T
  )
}
```

#### StaleWhileRevalidateAndStaleIfErrorAsyncDiskCache
```ts
class StaleWhileRevalidateAndStaleIfErrorAsyncDiskCache<T> implements IStaleWhileRevalidateAndStaleIfErrorAsyncCache<T> {
  constructor(
    cache: DiskCache
  , timeToLive: number
  , staleWhileRevalidate: number
  , staleIfError: number
  , toBuffer?: (value: T) => Buffer
  , fromBuffer?: (buffer: Buffer) => T
  )
}
```
