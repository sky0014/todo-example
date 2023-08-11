import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { Dropdown, List } from "antd";
import copy from "copy-to-clipboard";
import React from "react";
import Todo from "src/app/component/todo";
import { CatalogItem } from "src/store/catalog";
import { todo } from "src/store/todo";

function Catalog(props: { catalog: CatalogItem }) {
  console.log("render Catalog");

  const data = props.catalog.todos.slice().sort((a, b) => {
    const todoA = todo.items[a];
    const todoB = todo.items[b];
    if (todoA.isDone === todoB.isDone) {
      return todoB.createTime - todoA.createTime;
    }
    return todoA.isDone ? 1 : -1;
  });

  return (
    <List
      dataSource={data}
      renderItem={(todoId) => (
        <Dropdown
          key={todoId}
          trigger={["contextMenu"]}
          menu={{
            items: [
              {
                key: 1,
                label: "复制内容",
                icon: <CopyOutlined />,
                onClick: () => {
                  copy(todo.items[todoId].content);
                },
              },
              {
                key: 2,
                label: "删除",
                danger: true,
                icon: <DeleteOutlined />,
                onClick: () => {
                  todo.deleteTodo(todoId, props.catalog.id);
                },
              },
            ],
          }}
        >
          <List.Item>
            <Todo todo={todo.items[todoId]} />
          </List.Item>
        </Dropdown>
      )}
    />
  );
}

export default Catalog;
