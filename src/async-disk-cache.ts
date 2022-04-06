import { IAsyncCache } from 'extra-memoize'
import { DiskCache } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class AsyncDiskCache<T> implements IAsyncCache<T> {
  constructor(
    private cache: DiskCache
  , private toBuffer: (value: T) => Buffer = defaultToBuffer
  , private fromBuffer: (buffer: Buffer) => T = defaultFromBuffer
  ) {}

  async get(key: string): Promise<T | undefined> {
    const value = await this.cache.getData(key)
    if (isUndefined(value)) return undefined

    return this.fromBuffer(value)
  }

  async set(key: string, value: T): Promise<void> {
    await this.cache.setData(key, this.toBuffer(value))
  }
}
