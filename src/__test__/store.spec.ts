import { Store, action, createSrore } from "../store"
import { getMeta } from "../utils"

class MyStore extends Store {
    @action("add")
    add(count) {
        return {count: this.getState().count + count}
    }

    @action({pure: false})
    notPureAdd({count}, value) {
        return {count: count + value}
    }

    @action("sub")
    s(count) {
        return {count: this.getState().count - count}
    }

    @action("mul")
    mul(times) {
        return ({count}) => {
            return {count: count * times}
        }
    }
}

describe("store", () => {
    it("createStore by new", () => {
        let s = new Store({count: 1})
        expect(s.getState()).toEqual({count: 1})
    })

    it("getActions", () => {
        let s = new MyStore({count: 0})
        expect(s.getActions()).toHaveProperty("add")
        expect(s.getActions()).toHaveProperty("sub")
        expect(s.getActions() === s.getActions()).toBeTruthy()
    })

    it("not-pure-action", () => {
        let s = new MyStore({count: 0})
        s.getActions().notPureAdd(1)
        expect(s.getState().count).toBe(1)
    })

    it("meta", () => {
        let s = new MyStore({count: 0})
        let meta = getMeta(s.getActions().notPureAdd)
        expect(meta).toHaveProperty("pure", false)
        expect(meta).toHaveProperty("name", "notPureAdd")
        expect(meta.store === s).toBeTruthy()
    })

    it("sub", () => {
        let s = new MyStore({count: 0})
        let cb = jest.fn()
        s.subscribe(cb)
        s.getActions().add(1)
        expect(cb).toBeCalledWith({count: 1})
    })

    it("function as update", () => {
        let s = new MyStore({count: 2})
        s.getActions().mul(5)
        expect(s.getState().count).toBe(10)
    })

    it("sub && unsub", () => {
        let s = new MyStore({count: 0})
        let cb = jest.fn()
        let unsub = s.subscribe(cb)
        s.getActions().add(1)
        expect(cb).toHaveBeenCalledTimes(1)
        s.getActions().add(1)
        unsub()
        s.getActions().add(1)
        expect(cb).toHaveBeenCalledTimes(2)
    })
})

describe("createStore", () => {
    it("createStore by createStore", () => {
        let s = createSrore({count: 1}).actions((self) => ({
            add(count) {
                return {count: self.getState().count + count}
            },
            sub: {
                meta: {pure: false},
                value: ({count}, num) => {
                    return {count: count - num}
                }
            }
        }))

        expect(s.getState()).toEqual({count: 1})
        let actions = s.getActions()
        expect(actions).toHaveProperty("add")
        expect(actions).toHaveProperty("sub")

        actions.add(1)
        expect(s.getState()).toEqual({count: 2})
        actions.sub(1)
        expect(s.getState()).toEqual({count: 1})
    })
})