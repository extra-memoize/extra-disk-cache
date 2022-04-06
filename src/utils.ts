export function defaultToBuffer<T>(value: T): Buffer {
  return Buffer.from(JSON.stringify(value))
}

export function defaultFromBuffer<T>(buffer: Buffer): T {
  return JSON.parse(buffer.toString())
}
