import {
  isFunction,
  addOrCreateActions,
  setMeta,
  getMeta,
  getActionNames,
  set
} from "./utils"

import { compose } from "./middleware"

export interface IStore {
  middleware: Function
  setState: Function
  subscribe: Function
  getState: Function
}

function getActions(store: IStore) {
  let propertyKeys = getActionNames(store)
  return propertyKeys
    .filter(propertyKey => isFunction(store[propertyKey]))
    .reduce((actions, propertyKey) => {
      let action = store[propertyKey]
      let meta = getMeta(action)
      meta.store = store
      let name = meta.name || propertyKey
      let hasMiddleware = isFunction(store.middleware)
      actions[name] = (...args) => {
        if (meta.pure === false) args = [store.getState(), ...args]
        return hasMiddleware
          ? store.middleware(action, () =>
              set(store, store[propertyKey](...args))
            )
          : set(store, store[propertyKey](...args))
      }
      return actions
    }, {})
}

export const action = meta => (target, propertyKey, descriptor) => {
  if (!isFunction(descriptor.value)) {
    throw new TypeError("action decorator only decorate function member")
  }
  addOrCreateActions(target, propertyKey)
  if (!meta) {
    meta = { name: propertyKey }
  }
  if (typeof meta === "string") {
    meta = { name: meta }
  }
  setMeta(descriptor.value, meta)
  return descriptor
}

export class Store implements IStore {
  static middlewares: Function[] = []
  static use(...middleware) {
    Store.middlewares.push(...middleware)
  }
  private listeners: Function[] = []
  public middleware
  protected actions: any
  constructor(protected state: any = {}, ...middlewares) {
    this.middleware =
      Store.middlewares.length || middlewares.length
        ? compose([...Store.middlewares, ...middlewares])
        : null
  }

  getState() {
    return this.state
  }

  setState(update) {
    this.state =
      typeof update === "function"
        ? { ...this.state, ...update(this.state) }
        : { ...this.state, ...update }

    this.listeners.forEach(f => f(this.state))
  }

  subscribe(f) {
    this.listeners.push(f)
    return () => {
      this.listeners.splice(this.listeners.indexOf(f), 1)
    }
  }

  getActions() {
    return this.actions || (this.actions = getActions(this))
  }
}
