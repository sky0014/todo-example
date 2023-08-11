import { Checkbox } from "antd";
import React from "react";
import cn from "classnames";
import { TodoItem, todo } from "src/store/todo";

import style from "./index.module.styl";

function Todo(props: { todo: TodoItem }) {
  console.log("render todo");

  return (
    <Checkbox
      className={cn(style.todo, {
        [style.done]: props.todo.isDone,
      })}
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

export default Todo;
