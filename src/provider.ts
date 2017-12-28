import * as React from "react"
import { propsValidation } from "./utils"

const specialReactKeys = { children: true, key: true, ref: true }

export default class Provider extends React.Component<any, {}> {
  static childContextTypes = {
    stores: propsValidation
  }
  getChildContext() {
    if (this.props.store) {
      return { stores: Array.isArray(this.props.store) ? this.props.store : [this.props.store] }
    }
    const stores = {}
    for (let key in this.props) {
      if (!specialReactKeys[key]) stores[key] = this.props[key]
    }
    return { stores }
  }
  render() {
    const { children } = this.props
    return React.Children.only(children)
  }
}
