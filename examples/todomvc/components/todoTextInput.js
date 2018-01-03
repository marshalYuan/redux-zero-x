import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'redux-zero-x'

const ENTER_KEY = 13

@connect(['todoStore'])
export default class extends Component {
    render() {
        return (<input
			ref="newField"
			className="new-todo"
			placeholder="What needs to be done?"
			onKeyDown={this.handleNewTodoKeyDown}
			autoFocus={true}
		/>)
    }

    handleNewTodoKeyDown = (event) => {
		if (event.keyCode !== ENTER_KEY) {
			return
		}

		event.preventDefault()

        const val = ReactDOM.findDOMNode(this.refs.newField).value.trim()
        

		if (val) {
			this.props.addTodo(val);
			ReactDOM.findDOMNode(this.refs.newField).value = '';
		}
	};
}