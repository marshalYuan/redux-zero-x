import React from 'react'
import { Provider } from 'redux-zero-x'
import { TodoStore, ViewStore } from './store'
import App from './components/app'
import {ALL_TODOS} from './constants'

const initialState = window.initialState && JSON.parse(window.initialState) || {}
const todoStore = new TodoStore({todos:initialState.todos || []})
const viewStore = new ViewStore({todoFilter: ALL_TODOS})

export default () => (
    <Provider todoStore={todoStore} viewStore={viewStore}>
        <App />
    </Provider>
)