import React from 'react'
import Todo from './Todo'
import { v4 as uuidv4 } from 'uuid';

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos.map(todo =>
          <Todo
            key={ uuidv4() }
            todo={ todo }
            onDelete={ deleteTodo }
            onComplete={ completeTodo }/>
      )
        .reduce((acc, cur) => [...acc, <hr key={ uuidv4() }/>, cur], [])}
    </>
  )
}

export default TodoList
