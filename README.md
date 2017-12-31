# redux-zero-x

> A lightweight state container inspired by redux-zero and make usage like mobx

## Table of Contents

- [Installation](#installation)
- [How](#how)
- [Example](#examples)
- [Async](#async)
- [Middleware](#middleware)

## installation

`npm install @dwd/redux-zero-x`

## how

```js
import {Provider, connect, Store, action} from '@dwd/redux-zero-x'

class CounterStore extends Store {
    @action()
    increment() {
        return {count: this.getState().count + 1}
    }

    @action()
    decrement() {
        return {count: this.getState().count - 1}
    }

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

## examples

in every example project's dirctory, run
```
npm install && npm run start
```

## async

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

## middleware

```js
import { getMeta, Store } from '@dwd/redux-zero-x'

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
