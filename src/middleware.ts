import { IStore } from "./store"
import { set, isFunction } from "./utils"
import { action } from "./index"

export interface IMiddleware {
  (action: Function, next: Function): void
}

const logger: IMiddleware = function(action, next) {
  return next()
}

export function compose(middlewares: IMiddleware[]) {
  for (const fn of middlewares) {
    if (!isFunction(fn))
      throw new TypeError("All Middlewares must be composed of functions!")
  }
  return (action, next?: Function) => {
    let index = -1
    return dispatch(0)
    function dispatch(i) {
      if (i <= index) throw new Error("next() called multiple times")
      index = i
      let fn = middlewares[i]
      if (i === middlewares.length) fn = next as IMiddleware
      if (!fn) return
      return fn(action, () => dispatch(i + 1))
    }
  }
}
