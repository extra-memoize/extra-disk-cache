import { IStaleWhileRevalidateCache, State } from 'extra-memoize'
import { DiskCacheView } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'

export class StaleWhileRevalidateDiskCache<T> implements IStaleWhileRevalidateCache<T> {
  constructor(
    private view: DiskCacheView<string, T>
  , private timeToLive: number
  , private staleWhileRevalidate: number
  ) {}

  get(key: string): 
  | [State.Miss]
  | [State.Hit | State.StaleWhileRevalidate, T] {
    const item = this.view.getWithMetadata(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      const timestamp = Date.now()
      if (item.updatedAt + this.timeToLive > timestamp) {
        return [State.Hit, item.value]
      } else if (item.updatedAt + this.timeToLive + this.staleWhileRevalidate) {
        return [State.StaleWhileRevalidate, item.value]
      } else {
        return [State.Miss]
      }
    }
  }

  set(key: string, value: T): void {
    this.view.set(
      key
    , value
    , this.timeToLive + this.staleWhileRevalidate
    )
  }
}
