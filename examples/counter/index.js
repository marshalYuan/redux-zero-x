import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import { Provider, connect, Store, action } from 'redux-zero-x'

async function delay(t) {
    return new Promise((res, rej) => setTimeout(res, t))
}

Store.use(
    async (action, next) => {
        console.group( action['@@meta'].name)
        console.log('middle1start')
        console.log('next1', await next())
        console.log('middle1end')
        console.groupEnd( action['@@meta'].name)
    },
    async (action, next) => {
        console.log('middle2start')
        await delay(1000)
        console.log('next2', await next())
        console.log('middle2end')
    },
    async (action, next) => {
        console.log('middle3start')
        // await delay(1000)
        console.log('next3', await next())
        console.log('middle3end')
    }
)

class counter extends Store {
    @action()
    increase() {
        return { count: this.getState().count + 1}
    }

    @action()
    decrease() {
        return { count: this.getState().count - 1}
    }
}

class timer extends Store {
    interval

    @action()
    start() {
        this.interval = setInterval(() => this.setState({time: this.getState().time - 1}) ,1000)
    }

    @action()
    pause() {
        clearInterval(this.interval)
    }
}

@connect((state1, state2) => ({count: state1.count, time: state2.time}))
class Counter extends Component {
    render() {
        const {count, increase, decrease} = this.props
        const {time, start, pause} = this.props
        return (
            <div>
                <h1>{count}</h1>
                <div>
                    <button onClick={increase}>increment</button>
                    <button onClick={decrease}>decrement</button>
                </div>
                <h1>Time: {time}</h1>
                <div>
                    <button onClick={start}>start</button>
                    <button onClick={pause}>pause</button>
                </div>
            </div>
        )
    }
}

const App = () => (
    <Provider store={[new counter({count:1}),new timer({time:60})]}>
        <Counter />
    </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));