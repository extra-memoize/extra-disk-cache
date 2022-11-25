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
  constructor(view: DiskCacheView<string, T>)
}
```

#### StaleWhileRevalidateDiskCache
```ts
class StaleWhileRevalidateDiskCache<T> implements IStaleWhileRevalidateCache<T> {
  constructor(
    view: DiskCacheView<string, T>
  , timeToLive: number
  , staleWhileRevalidate: number
  )
}
```

#### StaleIfErrorDiskCache
```ts
class StaleIfErrorDiskCache<T> implements IStaleIfErrorCache<T> {
  constructor(
    view: DiskCacheView<string, T>
  , timeToLive: number
  , staleIfError: number
  )
}
```

#### StaleWhileRevalidateAndStaleIfErrorDiskCache
```ts
class StaleWhileRevalidateAndStaleIfErrorDiskCache<T> implements IStaleWhileRevalidateAndStaleIfErrorCache<T> {
  constructor(
    view: DiskCacheView<string, T>
  , timeToLive: number
  , staleWhileRevalidate: number
  , staleIfError: number
  )
}
```
