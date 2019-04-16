import { shallowEqual, isInherit, set, propsValidation } from "../utils"
import { Store } from "../store"

describe("utils", () => {
    it("shadowEqual", () => {
        expect(shallowEqual({a: 1}, {a: 1})).toBe(true)
        expect(shallowEqual({a: 1, b: 1}, {a: 1})).toBe(false)
        let foo = {}
        expect(shallowEqual({a: 1, b: {}}, {a: 1, b: {}})).toBe(false)
        expect(shallowEqual({a: 1, foo}, {a: 1, foo})).toBe(true)
    })

    it("isInherit", () => {
        class Parent {}
        class Child extends Parent {}

        expect(isInherit(Child, Parent)).toBe(true)
    })

    it("set", async () => {
        class MyStore extends Store<{count: number}> {
            add(count) {
                return {count: this.getState().count + count}
            }
            async asyncAdd(count) {
                return new Promise((res, rej) => {
                    setTimeout(_ => res({count: this.getState().count + count}), 0)
                })
            }
        }
        let store = new MyStore({count: 1})
        set(store, store.add(1))
        expect(store.getState()).toEqual({count: 2})
        await set(store, store.asyncAdd(1))
        expect(store.getState()).toEqual({count: 3})
    })

    it("propsValidation", () => {
        expect(propsValidation({stores: []}, "stores", "componentName")).toBeFalsy()
        expect(propsValidation({stores: {}}, "stores", "componentName")).toBeFalsy()
        let s = new Store()
        expect(propsValidation({stores: [s, {}]}, "stores", "componentName").message).toBe(`stores.1 is not an instance of Store`)
    })
})