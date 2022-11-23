import { IStaleIfErrorCache, State } from 'extra-memoize'
import { DiskCache, DiskCacheView } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class StaleIfErrorDiskCache<T> implements IStaleIfErrorCache<T> {
  private cache: DiskCacheView<string, T>

  constructor(
    cache: DiskCache
  , private timeToLive: number
  , private staleIfError: number
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
  | [State.Hit | State.StaleIfError, T] {
    const item = this.cache.get(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      const elapsed = Date.now() - item.updatedAt
      if (elapsed <= this.timeToLive) {
        return [State.Hit, item.value]
      } else if (elapsed <= this.timeToLive + this.staleIfError) {
        return [State.StaleIfError, item.value]
      } else {
        // just in case
        return [State.Miss]
      }
    }
  }

  set(key: string, value: T): void {
    this.cache.set(
      key
    , value
    , Date.now()
    , this.timeToLive + this.staleIfError
    )
  }
}
