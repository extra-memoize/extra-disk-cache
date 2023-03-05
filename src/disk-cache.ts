import { ICache, State } from 'extra-memoize'
import { DiskCacheView } from 'extra-disk-cache'
import { isUndefined } from '@blackglory/prelude'

export class DiskCache<T> implements ICache<T> {
  constructor(
    private view: DiskCacheView<string, T>
  , private timeToLive?: number
  ) {}

  get(key: string):
  | [State.Miss]
  | [State.Hit, T] {
    const item = this.view.getWithMetadata(key)
    if (isUndefined(item)) {
      return [State.Miss]
    } else {
      return [State.Hit, item.value]
    }
  }

  set(key: string, value: T): void {
    this.view.set(key, value, this.timeToLive)
  }
}
