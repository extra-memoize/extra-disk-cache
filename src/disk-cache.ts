import { ICache, State } from 'extra-memoize'
import { DiskCache as ExtraDiskCache, DiskCacheView } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'
import { defaultFromBuffer, defaultToBuffer } from './utils'

export class DiskCache<T> implements ICache<T> {
  private view: DiskCacheView<string, T>

  constructor(
    cache: ExtraDiskCache
  , toBuffer: (value: T) => Buffer = defaultToBuffer
  , fromBuffer: (buffer: Buffer) => T = defaultFromBuffer
  ) {
    this.view = new DiskCacheView<string, T>(
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
  | [State.Hit, T] {
    const item = this.view.get(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      return [State.Hit, item.value]
    }
  }

  set(key: string, value: T): void {
    this.view.set(key, value, Date.now())
  }
}
