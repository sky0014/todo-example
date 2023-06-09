import { Checkbox } from "antd";
import React, { memo } from "react";
import { TodoItem, todo } from "src/store/todo";

import style from "./index.module.styl";

function Todo(props: { todo: TodoItem }) {
  console.log("render todo");

  return (
    <Checkbox
      className={props.todo.isDone && style.done}
      defaultChecked={props.todo.isDone}
      onChange={(event) => {
        if (event.target.checked) {
          todo.completeTodo(props.todo.id);
        } else {
          todo.unCompleteTodo(props.todo.id);
        }
      }}
    >
      {props.todo.content}
    </Checkbox>
  );
}

export default memo(Todo);
