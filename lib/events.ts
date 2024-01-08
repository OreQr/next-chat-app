import EventEmitter2 from "eventemitter2"

const globalForEmitter = globalThis as unknown as {
  emitter: EventEmitter2 | undefined
}

export const emitter = globalForEmitter.emitter ?? new EventEmitter2()

globalForEmitter.emitter = emitter
