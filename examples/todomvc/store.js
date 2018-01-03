import { Store, action, getMeta } from 'redux-zero-x'

export class TodoStore extends Store {
    @action({pure: false})
    addTodo({todos}, title) {
        return {todos:[...todos, {
            id: todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
            completed: false,
            title
        }]}
    }

    @action
    editTodo(id, title) {
        const todos = this.getState().todos.map(
            todo => todo.id === id ?
                    { ...todo, title }: todo
        )
        return {todos}
    }

    @action
    deleteTodo(_id) {
        const todos = this.getState().todos.filter(({id}) => id !== _id)
        return {todos}
    }

    @action
    toggleAll (checked) {
        const todos = this.getState().todos.map(todo => todo.completed = checked)
        return {todos}
    }
    
    @action()
    clearCompleted() {
        const todos = this.getState().todos.filter(todo => !todo.completed)
        return {todos}
    }

    @action()
    complete(id) {
        const todos = this.getState().todos.map(
            todo => todo.id === id ?
                    { ...todo, completed: !todo.completed }: todo
        )
        return {todos}
    }
}

export class ViewStore extends Store {

    @action()
    changeFilter(todoFilter){
        return {todoFilter}
    }
}