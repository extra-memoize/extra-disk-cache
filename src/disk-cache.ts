import { ICache, State } from 'extra-memoize'
import { DiskCache as ExtraDiskCache } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class DiskCache<T> implements ICache<T> {
  constructor(
    private cache: ExtraDiskCache
  , private toBuffer: (value: T) => Buffer = defaultToBuffer
  , private fromBuffer: (buffer: Buffer) => T = defaultFromBuffer
  ) {}

  get(key: string):
  | [State.Miss]
  | [State.Hit, T] {
    const item = this.cache.get(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      return [State.Hit, this.fromBuffer(item.value)]
    }
  }

  set(key: string, value: T): void {
    this.cache.set(key, this.toBuffer(value), Date.now())
  }
}
