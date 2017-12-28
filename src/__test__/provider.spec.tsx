import * as React from "react"
import { mount } from "enzyme"

import Provider from "../provider"
import { Store } from "../store"

describe("react bindings", () => {

    describe("Provider", () => {
      it("should transform store to stores in the apps context", () => {
        const store = new Store()
        store.setState({ message: "hello" })

        class Comp extends React.Component {
          static contextTypes = {
            stores: () => null
          }
          render() {
            return <h1>{this.context.stores.length}</h1>
          }
        }

        const App = () => (
          <Provider store={store}>
            <Comp />
          </Provider>
        )
        const wrapper = mount(<App />)

        expect(wrapper.html()).toBe("<h1>1</h1>")
      })

      it("should get all stores in the apps context", () => {
        const store1 = new Store({a: 1})
        const store2 = new Store({b: 1})

        class Comp extends React.Component {
          static contextTypes = {
            stores: () => null
          }
          render() {
            return <h1>{Object.keys(this.context.stores).toString()}</h1>
          }
        }

        const App = () => (
          <Provider store1={store1} store2={store2}>
            <Comp />
          </Provider>
        )
        const wrapper = mount(<App />)

        expect(wrapper.html()).toBe(`<h1>${["store1", "store2"].toString()}</h1>`)
      })
    })
  })