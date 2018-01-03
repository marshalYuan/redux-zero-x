import React, { Component } from 'react'
import { connect } from 'redux-zero-x'

import TodoItem from './todoItem'
import { COMPLETED_TODOS, ACTIVE_TODOS } from '../constants'

@connect(['todoStore', 'viewStore'], ({todos}, {todoFilter}) => {
    const activeTodoCount = todos.reduce(
        (sum, todo) => sum + (todo.completed ? 0 : 1),
        0
    )
    return {activeTodoCount, todoFilter, todos} 
})
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
    
    renderToggle() {
        if(this.props.todos.length === 0) {
            return null
        }
        return (
            <span>
                <input className="toggle-all"
                    type="checkbox"
                    checked={this.props.activeTodoCount === 0}
                    />
                <label onClick={this.props.toggleAll}/>
            </span>
        )
    }

    render() {
        return (
            <section className="main">
                {this.renderToggle()}
                <ul className="todo-list">
                    {this.getVisibleTodos().map(todo =>
                        <TodoItem key={todo.id} todo={todo} />
                    )}
                </ul>
            </section>
        )
    }
}