import React, { Component } from 'react'
import { connect } from 'redux-zero-x'

import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants'

@connect(['todoStore', 'viewStore'], ({todos}, {todoFilter}) => {
    const activeTodoCount = todos.reduce(
        (sum, todo) => sum + (todo.completed ? 0 : 1),
        0
    )
    const completedCount = todos.length - activeTodoCount
    return {activeTodoCount, completedCount, todoFilter} 
})
export default class Footer extends Component {

    renderFilterLink(filterName, url, caption) {
		return (<li>
            <a style={{ cursor: 'pointer' }}
                onClick={() => this.props.changeFilter(filterName)}
				className={filterName ===  this.props.todoFilter ? "selected" : ""}>
				{caption}
			</a>
			{' '}
		</li>)
	}

    render() {
        if (!this.props.activeTodoCount && !this.props.completedCount)
			return null;

		const activeTodoWord = this.props.activeTodoCount === 1 ? 'item' : 'items'
        return (
            <footer className="footer">
				<span className="todo-count">
					<strong>{this.props.activeTodoCount}</strong> {activeTodoWord} left
				</span>
				<ul className="filters">
					{this.renderFilterLink(ALL_TODOS, "", "All")}
					{this.renderFilterLink(ACTIVE_TODOS, "active", "Active")}
					{this.renderFilterLink(COMPLETED_TODOS, "completed", "Completed")}
				</ul>
				{ this.props.completedCount === 0
					? null
					: 	<button
							className="clear-completed"
							onClick={this.props.clearCompleted}>
							Clear completed
						</button>
				}
			</footer>
        )
    }
}