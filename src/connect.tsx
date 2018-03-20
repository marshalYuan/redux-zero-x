import * as React from "react"

import { shallowEqual, isFunction, propsValidation } from "./utils"
// import propValidation from "../../utils/propsValidation"
// import bindActions from "../../utils/bindActions"

export interface P {
  children: (...args) => any
  stores?: string[]
  mapStateToProps?: (...args) => Object
  mapActionToProps?: any
  innerRef?: (ref: React.ReactElement<any>) => any
}

const defaultMapStateToProps = (...args) => {
  const states = args.slice(0, -1)
  let target = {}
  for (const state of states) {
    target = { ...target, ...state }
  }
  return target
}

const defaultMapActionToProps = defaultMapStateToProps

export function connect(): any
export function connect(
  mapStateToProps,
  mapActionToProps?: Function
): any
export function connect(
  stores: string[],
  mapStateToProps?: Function,
  mapActionToProps?: Function
): any
export default function connect(arg0?: string[] | Function, arg1?, arg2?) {
  let [stores, mapStateToProps, mapActionToProps] = [
    Array.isArray(arg0) && arg0,
    isFunction(arg0) ? arg0 : arg1 || defaultMapStateToProps,
    isFunction(arg0)
      ? arg1 || defaultMapActionToProps
      : arg2 || defaultMapActionToProps
  ]
  return (Child) => {

    return class ConnectWrapper extends React.Component<P, any> {
      static displayName = `ConnectWrapper(${Child.displayName || Child.name || "Component"})`
      static contextTypes = {
        stores: propsValidation
      }
      unsubscribe: Function[]
      stores = this.getStores()
      state = this.getProps()
      actions = this.getActions()
      componentWillMount() {
        this.unsubscribe = this.stores.map(s => s.subscribe(this.update))
      }
      componentWillUnmount() {
        this.unsubscribe.forEach(f => f(this.update))
      }
      getStores() {
        const { stores } = this.props
        if (!stores) {
          return Array.isArray(this.context.stores)
            ? this.context.stores
            : Object.keys(this.context.stores).map(key => this.context.stores[key])
        }
        return stores.map(key => {
          if (!(key in this.context.stores)) {
            throw new Error(`Can't find ${key} in Provider's props`)
          }
          return this.context.stores[key]
        })
      }
      getProps() {
        return mapStateToProps(...this.stores.map(s => s.getState()), this.props)
      }
      getActions() {
        return mapActionToProps(...this.stores.map(s => s.getActions()), this.props)
      }
      update = () => {
        const mapped = this.getProps()
        if (!shallowEqual(mapped, this.state)) {
          this.setState(mapped)
        }
      }

      setWrappedInstance = ref => {
        if (isFunction(this.props.innerRef))
          this.props.innerRef(ref)
      }

      render() {
        return React.createElement(Child, {stores: this.stores, ref: this.setWrappedInstance, ...this.props, ...this.state, ...this.actions})
      }
    }
  }
}