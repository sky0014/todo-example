import React, { MutableRefObject, forwardRef, useEffect, useRef } from "react";
import "./index.styl";
import Catalog from "src/app/component/catalog";
import { catalog } from "src/store/catalog";
import {
  Collapse,
  ConfigProvider,
  Input,
  InputProps,
  InputRef,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { todo } from "src/store/todo";

const AutoFocusInput = forwardRef<InputRef, InputProps>(function AutoFocusInput(
  props,
  ref
) {
  useEffect(() => {
    (ref as MutableRefObject<InputRef>)?.current?.focus();
  }, []);

  return <Input {...props} ref={ref} />;
});

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

                const onOk = () => {
                  const content = addInputRef.current?.input?.value;
                  if (content) {
                    todo.addTodo({
                      catalogId: catalog.id,
                      content,
                    });
                  }
                };
                const modal = Modal.confirm({
                  icon: null,
                  title: "请输入",
                  autoFocusButton: null,
                  content: (
                    <AutoFocusInput
                      placeholder="您的待办事项"
                      ref={addInputRef}
                      onPressEnter={() => {
                        onOk();
                        modal.destroy();
                      }}
                    />
                  ),
                  onOk,
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
