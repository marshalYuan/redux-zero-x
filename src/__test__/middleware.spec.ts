import { compose } from "../middleware"

describe("middleware", () => {
    it("compose", () => {
        let temp = 1
        let action = {}
        let middleware1 = (action, next) => {
            temp++
            return next()
        }
        let middleware2 = (action, next) => {
            temp += 2
            return next()
        }
        let middleware = compose([middleware1, middleware2])
        let fn = jest.fn()
        middleware(action, fn)
        expect(temp).toBe(4)
        expect(fn).toBeCalled()
    })
})