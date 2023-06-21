import React, { memo } from "react";
import { TodoItem, todo } from "src/store/todo";

function Todo(props: { todo: TodoItem }) {
  console.log("render todo");

  return (
    <div onClick={() => todo.completeTodo(props.todo.id)}>
      {props.todo.content} {props.todo.isDone && "done"}
    </div>
  );
}

export default memo(Todo);
