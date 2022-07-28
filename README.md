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
#### DiskCache
```ts
class DiskCache<T> implements ICache<T> {
  constructor(
    cache: ExtraDiskCache
  , toBuffer?: (value: T) => Buffer
  , fromBuffer?: (buffer: Buffer) => T
  )
}
```

#### StaleWhileRevalidateDiskCache
```ts
class StaleWhileRevalidateDiskCache<T> implements IStaleWhileRevalidateCache<T> {
  constructor(
    cache: ExtraDiskCache
  , timeToLive: number
  , staleWhileRevalidate: number
  , toBuffer?: (value: T) => Buffer
  , fromBuffer?: (buffer: Buffer) => T
  )
}
```

#### StaleIfErrorDiskCache
```ts
class StaleIfErrorDiskCache<T> implements IStaleIfErrorCache<T> {
  constructor(
    cache: ExtraDiskCache
  , timeToLive: number
  , staleIfError: number
  , toBuffer?: (value: T) => Buffer
  , fromBuffer?: (buffer: Buffer) => T
  )
}
```

#### StaleWhileRevalidateAndStaleIfErrorDiskCache
```ts
class StaleWhileRevalidateAndStaleIfErrorDiskCache<T> implements IStaleWhileRevalidateAndStaleIfErrorCache<T> {
  constructor(
    cache: ExtratDiskCache
  , timeToLive: number
  , staleWhileRevalidate: number
  , staleIfError: number
  , toBuffer?: (value: T) => Buffer
  , fromBuffer?: (buffer: Buffer) => T
  )
}
```
