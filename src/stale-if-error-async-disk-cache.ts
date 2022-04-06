import { IStaleIfErrorAsyncCache, State } from 'extra-memoize'
import { DiskCache } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class StaleIfErrorAsyncDiskCache<T> implements IStaleIfErrorAsyncCache<T> {
  constructor(
    private cache: DiskCache
  , private timeToLive: number
  , private staleIfError: number
  , private toBuffer: (value: T) => Buffer = defaultToBuffer
  , private fromBuffer: (buffer: Buffer) => T = defaultFromBuffer
  ) {}

  async get(key: string): Promise<
  | [State.Miss, undefined]
  | [State.Hit | State.StaleIfError, T]
  > {
    const value = await this.cache.getData(key)
    const metadata = this.cache.getMetadata(key)
    if (isUndefined(value) || isUndefined(metadata)) return [State.Miss, undefined]

    const elapsed = Date.now() - metadata.updatedAt
    if (elapsed <= this.timeToLive) {
      return [State.Hit, this.fromBuffer(value)]
    } else if (elapsed <= this.timeToLive + this.staleIfError) {
      return [State.StaleIfError, this.fromBuffer(value)]
    } else {
      // just in case
      return [State.Miss, undefined]
    }
  }

  async set(key: string, value: T): Promise<void> {
    await this.cache.set(
      key
    , this.toBuffer(value)
    , Date.now()
    , this.timeToLive
    , this.staleIfError
    )
  }
}
