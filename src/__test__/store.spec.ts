import { Store, action, createStore } from "../store"
import { Actions } from "../types"
import { getMeta } from "../utils"
import { ActionsExclude } from "..";

class MyStore extends Store<{count: number}> {
    @action
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

    @action({fake: true})
    fakeAction(message: string) {
        return "hello, " + message
    }

    @action({fake: true})
    fakeActionWithWarn(message: string) {
        return this.getState()
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

    it("getActions for typescript", () => {
        let s = new MyStore({count: 0})
        let actions = s.getActions() as Actions<typeof s>
        expect(actions.add(1)).toBe(undefined)
        expect(actions.mul(5)).toBe(undefined)
    })

    it("not-pure-action", () => {
        let s = new MyStore({count: 0})
        s.getActions().notPureAdd(1)
        expect(s.getState().count).toBe(1)
    })

    it("fake action", () => {
        let s = new MyStore({count: 0})
        console.warn = jest.fn()
        let actions = s.getActions() as ActionsExclude<typeof s, "fakeAction" | "fakeActionWithWarn">
        expect(actions.fakeAction("redux-zero-x")).toBe("hello, redux-zero-x")

        actions.fakeActionWithWarn("redux-zero-x")
        expect((console.warn as any).mock.calls[0][0]).toBe("Method getState can't be called in a fake action")
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
        let s = createStore({count: 1}).actions((self) => ({
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