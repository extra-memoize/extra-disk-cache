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
    const item = this.view.get(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      const elapsed = Date.now() - item.updatedAt
      if (elapsed <= this.timeToLive) {
        return [State.Hit, item.value]
      } else if (elapsed <= this.timeToLive + this.staleWhileRevalidate) {
        return [State.StaleWhileRevalidate, item.value]
      } else if (elapsed <= this.timeToLive + this.staleWhileRevalidate + this.staleIfError) {
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
    , Date.now()
    , this.timeToLive + this.staleWhileRevalidate + this.staleIfError
    )
  }
}
