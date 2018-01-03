import React, { Component } from 'react'
import { connect } from 'redux-zero-x'

import TodoItem from './todoItem'
import { COMPLETED_TODOS, ACTIVE_TODOS } from '../constants'

@connect(['todoStore', 'viewStore'])
export default class MainSection extends Component {

	getVisibleTodos() {
        const {todos, todoFilter} = this.props
		return todos.filter(todo => {
			switch (todoFilter) {
				case ACTIVE_TODOS:
					return !todo.completed;
				case COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
			}
		});
	}

    render() {
        return (
            <section className="main">
                <ul className="todo-list">
                    {this.getVisibleTodos().map(todo =>
                        <TodoItem key={todo.id} todo={todo} />
                    )}
                </ul>
            </section>
        )
    }
}