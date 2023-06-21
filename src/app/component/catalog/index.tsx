import React, { memo } from "react";
import Todo from "src/app/component/todo";
import { CatalogItem } from "src/store/catalog";
import { todo } from "src/store/todo";

function Catalog(props: { catalog: CatalogItem }) {
  console.log("render Catalog");

  return (
    <div>
      <div>{props.catalog.name}</div>
      <div>{props.catalog.description}</div>
      <button
        onClick={() =>
          todo.addTodo({
            catalogId: props.catalog.id,
            content: "tttttt" + Math.random(),
          })
        }
      >
        +
      </button>
      <div>
        {props.catalog.todos.map((id) => (
          <Todo key={id} todo={todo.items[id]} />
        ))}
      </div>
    </div>
  );
}

export default memo(Catalog);
