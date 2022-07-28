import { IStaleWhileRevalidateCache, State } from 'extra-memoize'
import { DiskCache } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class StaleWhileRevalidateDiskCache<T> implements IStaleWhileRevalidateCache<T> {
  constructor(
    private cache: DiskCache
  , private timeToLive: number
  , private staleWhileRevalidate: number
  , private toBuffer: (value: T) => Buffer = defaultToBuffer
  , private fromBuffer: (buffer: Buffer) => T = defaultFromBuffer
  ) {}

  get(key: string): 
  | [State.Miss]
  | [State.Hit | State.StaleWhileRevalidate, T] {
    const item = this.cache.get(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      if (this.isStaleWhileRevalidate(item.updatedAt)) {
        return [State.StaleWhileRevalidate, this.fromBuffer(item.value)]
      } else {
        return [State.Hit, this.fromBuffer(item.value)]
      }
    }
  }

  set(key: string, value: T): void {
    this.cache.set(
      key
    , this.toBuffer(value)
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
