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

export const getMeta = target => target[META]

export const setMeta = (target, meta) => (target[META] = meta)

export const getActionNames = target => target[ACTIONS]

export const addOrCreateActions = (target, propertyKey) =>
  target[ACTIONS]
    ? target[ACTIONS].push(propertyKey)
    : (target[ACTIONS] = [propertyKey])

export const isFunction = obj => typeof obj === "function"

export const isInherit = (A, B) => A === B || typeof A.prototype === B

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
  if (Array.isArray(props[propName])) {
    for (const s of props[propName]) {
      if (s instanceof Store) {
        break
      }
      return new Error(`${s} is not an instance of Store`)
    }
  } else {
    return new Error(`Invalid prop ${propName} supplied to ${componentName}`)
  }
}
