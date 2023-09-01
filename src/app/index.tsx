import React, { MutableRefObject, forwardRef, useEffect, useRef } from "react";
import Catalog from "src/app/component/catalog";
import { catalog } from "src/store/catalog";
import {
  Col,
  Collapse,
  ConfigProvider,
  Dropdown,
  Input,
  InputProps,
  InputRef,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { todo } from "src/store/todo";
import { useDarkMode } from "src/common/hooks/useDarkMode";
import { config } from "src/store/config";

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

  const isDarkMode = useDarkMode();
  const [modal, contextHolder] = Modal.useModal();
  const addInputRef = useRef<InputRef>(null);

  useEffect(() => {
    document.body.className = config.theme;
  }, [config.theme]);

  useEffect(() => {
    if (config.autoTheme) {
      config.changeTheme(isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode, config.autoTheme]);

  return (
    <ConfigProvider theme={config.themeConfig}>
      <Space direction="vertical">
        <Row justify="space-between">
          <Col>
            <Typography.Text>你的待办</Typography.Text>
          </Col>
          <Col>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "auto",
                    label: "跟随系统",
                  },
                  {
                    key: "light",
                    label: "白天",
                  },
                  {
                    key: "dark",
                    label: "黑夜",
                  },
                ],
                selectable: true,
                defaultSelectedKeys: [config.autoTheme ? "auto" : config.theme],
                onClick(info) {
                  if (info.key === "auto") {
                    config.setAutoTheme(true);
                  } else {
                    config.setAutoTheme(false);
                    config.changeTheme(info.key as any);
                  }
                },
              }}
            >
              <Typography.Link>
                <Space>
                  主题
                  <DownOutlined />
                </Space>
              </Typography.Link>
            </Dropdown>
          </Col>
        </Row>

        <Collapse
          onChange={(key) => {
            const arr = key as string[];
            Object.values(catalog.items).forEach((item) => {
              const expand = arr.indexOf(item.id) !== -1;
              if (expand !== item.expand) {
                catalog.modify({ id: item.id, expand });
              }
            });
          }}
          defaultActiveKey={Object.values(catalog.items)
            .filter((catalog) => catalog.expand)
            .map((catalog) => catalog.id)}
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
                  const { destroy } = modal.confirm({
                    icon: null,
                    title: "请输入",
                    autoFocusButton: null,
                    content: (
                      <AutoFocusInput
                        placeholder="您的待办事项"
                        ref={addInputRef}
                        onPressEnter={() => {
                          onOk();
                          destroy();
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
      </Space>

      {contextHolder}
    </ConfigProvider>
  );
}

export default App;
