import { IStaleWhileRevalidateAsyncCache } from 'extra-memoize'
import { DiskCache } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class StaleWhileRevalidateAsyncDiskCache<T> implements IStaleWhileRevalidateAsyncCache<T> {
  constructor(
    private cache: DiskCache
  , private timeToLive: number
  , private staleWhileRevalidate: number
  , private toBuffer: (value: T) => Buffer = defaultToBuffer
  , private fromBuffer: (buffer: Buffer) => T = defaultFromBuffer
  ) {}

  async get(key: string): Promise<T | undefined> {
    const value = await this.cache.getData(key)
    if (isUndefined(value)) return undefined

    return this.fromBuffer(value)
  }

  async set(key: string, value: T): Promise<void> {
    await this.cache.set(
      key
    , this.toBuffer(value)
    , Date.now()
    , this.timeToLive
    , this.staleWhileRevalidate
    )
  }

  async isStaleWhileRevalidate(key: string): Promise<boolean> {
    const metadata = this.cache.getMetadata(key)
    if (isUndefined(metadata)) return false

    const elapsed = Date.now() - metadata.updatedAt
    return elapsed > this.timeToLive
        && elapsed < this.timeToLive + this.staleWhileRevalidate
  }
}
