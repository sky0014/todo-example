import React, { useRef } from "react";
import "./index.styl";
import Catalog from "src/app/component/catalog";
import { catalog } from "src/store/catalog";
import { Collapse, ConfigProvider, Input, InputRef, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { todo } from "src/store/todo";

function App() {
  console.log("render app");

  const addInputRef = useRef<InputRef>(null);

  return (
    <ConfigProvider
      theme={{
        components: {
          Checkbox: {
            colorPrimary: "#d9d9d9",
            colorPrimaryHover: "#8c8c8c",
          },
        },
      }}
    >
      <Collapse
        defaultActiveKey={Object.values(catalog.items).map(
          (catalog) => catalog.id
        )}
        items={Object.values(catalog.items).map((catalog) => ({
          key: catalog.id,
          label: `${catalog.description} (${catalog.name})`,
          children: <Catalog key={catalog.id} catalog={catalog} />,
          extra: (
            <PlusOutlined
              onClick={(event) => {
                event.stopPropagation();
                Modal.confirm({
                  icon: null,
                  title: "请输入",
                  content: (
                    <Input placeholder="您的待办事项" ref={addInputRef} />
                  ),
                  onOk() {
                    const content = addInputRef.current?.input?.value;
                    if (content) {
                      todo.addTodo({
                        catalogId: catalog.id,
                        content,
                      });
                    }
                  },
                });
              }}
            />
          ),
        }))}
      />
    </ConfigProvider>
  );
}

export default App;
