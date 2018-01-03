import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'redux-zero-x'

import TodoTextInput from './todoTextInput'

const ENTER_KEY = 13
const ESCAPE_KEY = 27

@connect(['viewStore', 'todoStore'])
export default class TodoItem extends Component {
    state = {
        editing: false,
    }

    handleToggle = () => this.props.complete(this.props.todo.id)

    handleEdit = () => {
        this.setState({editing: true, editText: this.props.todo.title}, () =>  {
            const node = ReactDOM.findDOMNode(this.refs.editField)
            node.focus()
            node.setSelectionRange(node.value.length, node.value.length)
        })
    }

    handleChange = (e) => {
        this.setState({editText: e.target.value})
    }

    handleKeyDown = (event) => {
		if (event.keyCode === ENTER_KEY) {
			this.handleSubmit()
        } else if (event.keyCode === ESCAPE_KEY) {
            this.cancelEdit()
        }
    }

    cancelEdit() {
        this.setState({
            editing: false,
            editText: this.props.todo.title
        })
    }

    handleSubmit = () => {
        const text = this.state.editText
        const {id} = this.props.todo
        if (text.length === 0) {
            this.props.deleteTodo(id)
          } else {
            this.props.editTodo(id, text)
        }
        this.setState({editing: false})
    }

    

    render() {
        const {todo, deleteTodo} = this.props
        const editing = this.state.editing ? "editing" : ""
        let element
        if (this.state.editing) {
            element = (
                <input
                    ref="editField"
                    className="edit"
                    value={this.state.editText}
                    onBlur={this.handleSubmit}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />
            )
        } else {
            element = (
                <div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={todo.completed}
						onChange={this.handleToggle}
					/>
					<label onDoubleClick={this.handleEdit}>
						{todo.title}
					</label>
					<button className="destroy" onClick={() => deleteTodo(todo.id)} />
				</div>
            )
        }
        return (
			<li className={[
				todo.completed ? "completed": "",
				editing
			].join(" ")}>
				{element}
			</li>
		);
    }
}