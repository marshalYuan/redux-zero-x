import { IStore, Store } from "../store"

export const shallowEqual = (a, b) => {
  for (const i in a) if (a[i] !== b[i]) return false
  for (const i in b) if (!(i in a)) return false
  return true
}

export function derive(store, state = {}, keys) {
  const listeners = []
  return {
    middleware: store.middleware,
    setState(update) {
      if (typeof update === "function") {
        update = update(state)
      }
      state = { ...state, ...update }
      listeners.forEach(f => f(state))
      if (store) {
        keys = keys || Object.keys(store.getState())
        let _state = store.getState()
        for (let key in update) {
          if (key in _state) {
            store.setState(update)
            break
          }
        }
      }
    },
    subscribe(f) {
      let unsub = store && store.subscribe(f)
      listeners.push(f)
      return () => {
        if (unsub) unsub()
        listeners.splice(listeners.indexOf(f), 1)
      }
    },
    getState() {
      return store ? { ...state, ...store.getState() } : state
    }
  }
}

const META = "@@meta"
const ACTIONS = "@@actions"

export const getMeta = target => target[META] || {}

export const setMeta = (target, meta) => (target[META] = meta)

export const getActionNames = target => target[ACTIONS] || []

export const addOrCreateActions = (target, propertyKey) =>
  target[ACTIONS]
    ? target[ACTIONS].push(propertyKey)
    : (target[ACTIONS] = [propertyKey])

export const isFunction = obj => typeof obj === "function"

export const isInherit = (Child, Parent) => Child === Parent || Child.prototype instanceof Parent

export function set(store: IStore, ret) {
  if (ret != null) {
    if (ret.then) return ret.then(store.setState)
    store.setState(ret)
  }
}

export function propsValidation(
  props: object,
  propName: string,
  componentName: string
) {
  if (props[propName]) {
    for (const key in props[propName]) {
      if (props[propName][key] instanceof Store) {
        continue
      }
      return new Error(`stores.${key} is not an instance of Store`)
    }
    return
  }
  return new Error(`Invalid prop ${propName} supplied to ${componentName}`)
}
