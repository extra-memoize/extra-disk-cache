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
      if (this.isStaleWhileRevalidate(item.updatedAt)) {
        return [State.StaleWhileRevalidate, item.value]
      } else {
        return [State.Hit, item.value]
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

  private isStaleWhileRevalidate(updatedAt: number): boolean {
    const elapsed = Date.now() - updatedAt
    return elapsed > this.timeToLive
        && elapsed < this.timeToLive + this.staleWhileRevalidate
  }
}
