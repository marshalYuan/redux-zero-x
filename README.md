# redux-zero-x

> A lightweight state container inspired by redux-zero and make usage like mobx

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#examples)
- [Action](#action)
- [Async](#async)
- [Middleware](#middleware)
- [Typescript](#typescript)

## Installation

`npm install redux-zero-x`

## Usage

### use decorator
```js
import {Provider, connect, Store, action} from 'redux-zero-x'

class CounterStore extends Store {
    @action({throttle: 1000})
    increment() {
        return {count: this.getState().count + 1}
    }
    //no meta
    @action
    decrement() {
        return {count: this.getState().count - 1}
    }
    // if set pure with false, the first argument is store's current state
    @action({pure: false})
    mul({count}, times) {
        return {count: count * times}
    }
}

const Counter = connect(['counterStore'])(({count, increment, decrement}) => (
    <div>
        <h1>{count}</h1>
        <div>
        <button onClick={decrement}>decrement</button>
        <button onClick={increment}>increment</button>
        </div>
    </div>
))

const App = () => (
  <Provider counterStore={new CounterStore({count: 0})}>
    <Counter />
  </Provider>
);

render(<App />, document.getElementById("root"));
```

### use createStore

```js
import {createStore} from 'redux-zero-x'

const counterStore = createStore({count:1}).actions(self => ({
    increment() {
        return {count: self.getState().count + 1}
    }

    decrement() {
        return {count: self.getState().count - 1}
    }
    
    mul: {
        meta: {pure: false},
        value: ({count}, times) => ({count: count * times})
    }
}))
```

## Examples

in every example project's dirctory, run
```
npm install && npm run start
```

## Action

In redux-zero-x, action is a function with some meta info and return update

```js
@action(meta)
doSomething() {
    // update is an object
    return {foo:1}
}
```
or
```js
@action(meta)
doSomething() {
    // update is an function
    return (state) => update
}
```

### meta info

You can declare meta-info for action, and get it in [middleware](#middleware).

```js
import { getMeta } from 'redux-zero-x'

let throttleMap = new Map()
function throttleMiddleware(action, next) {
    const meta = getMeta(action)
    const {throttle} = meta
    if(!throttle) return next()

    const now = Date.now()
    if(!throttleMap.has(action) || now - throttleMap.get(action) >= throttle) {
        throttleMap.set(action, now)
        return next()
    }
}
```

### pure action

By default, every action is pure. You can use `meta.pure = flase` to set action-function's first argument with current state, or use `Store.defaultConfig.pure = false` to make all actions be pure.

### fake action

If you want add some method which is state-free. You can add meta `{fake: true}` to the action decorator.

> you can't use store's all methods in fake action

```js
@action({fake: true})
doSomethingWithReturnValue() {
    return "welcome"
}

// you can get return value from fake actions
let message = s.doSomethingWithReturnValue()
```

## Async

```js
async function getUserInfo(userId) {
    return fetch(`/user/${userId}`).then(resp => resp.json())
}

class myStore extends Store {
    toggleLoading(loading) {
        if(loading === undefined) {
            loading = !this.getState().loading
        }
        this.setState({loading})
    }

    @action()
    async fetchUser(id) {
        this.toggleLoading()
        const user = await getUserInfo(id)
        this.toggleLoading()
        return {user: user}
    }
}
```

## Middleware

```js
import { getMeta } from 'redux-zero-x'

async function loggerMiddleware(action, next) {
    const meta = getMeta(action)
    console.group(`${meta.name}`)
    await next()
    console.groupEnd(`${meta.name}`)
}

async function delayMiddleware(action, next) {
    await delay(100)
    next()
}

// global middlewares
Store.use(loggerMiddleware, delayMiddleware)

// store middlewares
let store = new Store({count: 1}, loggerMiddleware, delayMiddleware)
```

## Typescript

```ts
// typescript >= 2.8
import {Actions, ActionsExclude, action, Store} from 'redux-zero-x'

export interface IState {
    count: number
}
class MyStore extends Store<IState> {
    private _something() {
        doSomething()
    }

    @action
    add(count: number) {
        return {count: this.getState().count + 1}
    }
}
export type IMyStore = Actions<MyStore>


class MyOtherStore extends Store<IState> {
    @action
    add(count: number) {
        return {count: this.getState().count + 1}
    }

    @action({fake: true})
    fakeAction1() {
        return "welcome"
    }

    @action({fake: true})
    fakeAction2() {
        return "welcome1"
    }
}

// exclude some action
export IMyOtherStore = ActionsExclude<MyOtherStore, "fakeAction1" | "fakeAction2">

```



## License

MIT