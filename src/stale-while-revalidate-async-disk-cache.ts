import { IStaleWhileRevalidateCache, State } from 'extra-memoize'
import { DiskCache, DiskCacheView } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class StaleWhileRevalidateDiskCache<T> implements IStaleWhileRevalidateCache<T> {
  private cache: DiskCacheView<string, T>

  constructor(
    cache: DiskCache
  , private timeToLive: number
  , private staleWhileRevalidate: number
  , toBuffer: (value: T) => Buffer = defaultToBuffer
  , fromBuffer: (buffer: Buffer) => T = defaultFromBuffer
  ) {
    this.cache = new DiskCacheView<string, T>(
      cache
    , {
        toString: x => x
      , fromString: x => x
      }
    , {
        toBuffer
      , fromBuffer
      }
    )
  }

  get(key: string): 
  | [State.Miss]
  | [State.Hit | State.StaleWhileRevalidate, T] {
    const item = this.cache.get(key)
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
    this.cache.set(
      key
    , value
    , Date.now()
    , this.timeToLive + this.staleWhileRevalidate
    )
  }

  private isStaleWhileRevalidate(updatedAt: number): boolean {
    const elapsed = Date.now() - updatedAt
    return elapsed > this.timeToLive
        && elapsed < this.timeToLive + this.staleWhileRevalidate
  }
}
