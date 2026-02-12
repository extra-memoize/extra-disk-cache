import { IStaleWhileRevalidateAndStaleIfErrorCache, State } from 'extra-memoize'
import { DiskCacheView } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'

export class StaleWhileRevalidateAndStaleIfErrorDiskCache<T> implements IStaleWhileRevalidateAndStaleIfErrorCache<T> {
  constructor(
    private view: DiskCacheView<string, T>
  , private timeToLive: number
  , private staleWhileRevalidate: number
  , private staleIfError: number
  ) {}

  get(key: string):
  | [State.Miss]
  | [State.Hit | State.StaleWhileRevalidate | State.StaleIfError, T] {
    const item = this.view.getWithMetadata(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      const timestamp = Date.now()
      if (
        item.updatedAt
      + this.timeToLive
      > timestamp
      ) {
        return [State.Hit, item.value]
      } else if (
        item.updatedAt
      + this.timeToLive
      + this.staleWhileRevalidate
      > timestamp
      ) {
        return [State.StaleWhileRevalidate, item.value]
      } else if (
        item.updatedAt
      + this.timeToLive
      + this.staleWhileRevalidate
      + this.staleIfError
      > timestamp
      ) {
        return [State.StaleIfError, item.value]
      } else {
        // just in case
        return [State.Miss]
      }
    }
  }

  set(key: string, value: T): void {
    this.view.set(
      key
    , value
    , this.timeToLive + this.staleWhileRevalidate + this.staleIfError
    )
  }
}
