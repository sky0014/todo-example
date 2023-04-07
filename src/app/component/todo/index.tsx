import { observe } from "@sky0014/store";
import React, { memo } from "react";
import { TodoItem, todo } from "src/store/todo";

function Todo(props: { todo: TodoItem }) {
  console.log("render todo");

  return (
    <div onClick={() => todo.completeTodo(props.todo.id)}>
      {props.todo.content} {props.todo.doneTime && "done"}
    </div>
  );
}

export default memo(observe(Todo));
