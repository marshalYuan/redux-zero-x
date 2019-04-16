import {
  isFunction,
  addOrCreateActions,
  setMeta,
  getMeta,
  getActionNames,
  set,
  isUndefined
} from "./utils"
import { Actions } from "./types"

import { compose } from "./middleware"

export interface IStore<S> {
  middleware: Function
  setState: Function
  subscribe: Function
  getState: Function
  actions: (creater: any) => IStore<S>
  getActions: () => any
}

function getActions<S>(store: IStore<S>) {
  let propertyKeys = getActionNames(store)
  return propertyKeys
    .filter(propertyKey => isFunction(store[propertyKey]))
    .reduce((actions, propertyKey) => {
      let action = store[propertyKey]
      let meta = getMeta(action)
      meta.store = store
      meta.pure = isUndefined(meta.pure) ? Store.defaultConfig.pure : !!meta.pure
      let name = meta.name || (meta.name = propertyKey)
      let hasMiddleware = isFunction(store.middleware)
      actions[name] = (...args) => {
        if (meta.pure === false) args = [store.getState(), ...args]
        return hasMiddleware
          ? store.middleware(action, () =>
              set(store, store[propertyKey](...args))
            )
          : set(store, store[propertyKey](...args))
      }
      setMeta(actions[name], meta)
      return actions
    }, {})
}

const actionDecorator = meta => (target, propertyKey, descriptor) => {
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

export function action(arg1?, arg2?, arg3?) {
  if (arguments.length === 3) {
    return actionDecorator({})(arg1, arg2, arg3)
  } else {
    const meta = arg1
    return actionDecorator(meta)
  }
}

export class Store<S = {}> implements IStore<S> {
  static middlewares: Function[] = []
  static defaultConfig = {
    pure: true
  }
  static use(...middleware) {
    Store.middlewares.push(...middleware)
  }
  private listeners: Function[] = []
  public middleware
  protected _actions: Actions<this>
  protected state: S
  constructor(initialState?: S, ...middlewares) {
    this.state = initialState || {} as S
    this.middleware =
      Store.middlewares.length || middlewares.length
        ? compose([...Store.middlewares, ...middlewares])
        : null
    this.setState = this.setState.bind(this)
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
    return this._actions || (this._actions = getActions(this))
  }

  actions(creater: (self: this) => any) {
    if (!isFunction(creater)) {
      throw new TypeError(`actions expect a function, but get ${creater}`)
    }
    const actions = creater(this)

    for (const key in actions) {
      if (actions.hasOwnProperty(key)) {
        const action = actions[key]
        if (isFunction(action)) {
          this[key] = action
          addOrCreateActions(this, key)
        } else if (isFunction(action.value)) {
          setMeta(action.value, action.meta)
          this[key] = action.value
          addOrCreateActions(this, key)
        } else {
          console.warn(`${action} is an invalid action`)
        }
      }
    }
    return this
  }
}


export function createStore<S>(initState?: S, ...middlewares) {
  return new Store<S>(initState, ...middlewares)
}