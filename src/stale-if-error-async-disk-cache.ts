import { IStaleIfErrorCache, State } from 'extra-memoize'
import { DiskCache } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class StaleIfErrorDiskCache<T> implements IStaleIfErrorCache<T> {
  constructor(
    private cache: DiskCache
  , private timeToLive: number
  , private staleIfError: number
  , private toBuffer: (value: T) => Buffer = defaultToBuffer
  , private fromBuffer: (buffer: Buffer) => T = defaultFromBuffer
  ) {}

  get(key: string):
  | [State.Miss]
  | [State.Hit | State.StaleIfError, T] {
    const item = this.cache.get(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      const elapsed = Date.now() - item.updatedAt
      if (elapsed <= this.timeToLive) {
        return [State.Hit, this.fromBuffer(item.value)]
      } else if (elapsed <= this.timeToLive + this.staleIfError) {
        return [State.StaleIfError, this.fromBuffer(item.value)]
      } else {
        // just in case
        return [State.Miss]
      }
    }
  }

  set(key: string, value: T): void {
    this.cache.set(
      key
    , this.toBuffer(value)
    , Date.now()
    , this.timeToLive + this.staleIfError
    )
  }
}
