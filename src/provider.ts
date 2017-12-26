import * as React from "react"
import { propsValidation } from "./utils"

// import Props from "../../interfaces/Props"
// import Store from "../../interfaces/Store"
// import propValidation from "../../utils/propsValidation"

const specialReactKeys = { children: true, key: true, ref: true }

export default class Provider extends React.Component<any, {}> {
  static childContextTypes = {
    stores: propsValidation
  }
  getChildContext() {
    if (Array.isArray(this.props.store)) {
        return { stores: this.props.store }
    }
    const stores = {}
    for (let key in this.props) {
        if (!specialReactKeys[key])
            stores[key] = this.props[key]
    }
    return { stores }
  }
  render() {
    const { children } = this.props
    return React.Children.only(children)
  }
}
