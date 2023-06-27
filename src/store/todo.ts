// store设计原则：归一化
// https://cn.redux.js.org/usage/structuring-reducers/normalizing-state-shape
import { configStore, createStore, persist } from "@sky0014/store";
import { catalog } from "src/store/catalog";
import { v4 as uuidV4 } from "uuid";

configStore({
  debug: true,
});

export class TodoItem {
  id!: string;
  catalogId!: string;
  content!: string;
  createTime!: number;
  doneTime?: number;
  deadline?: number;

  get isDone() {
    return !!this.doneTime;
  }

  constructor(init: {
    id: string;
    catalogId: string;
    content: string;
    createTime?: number;
    doneTime?: number;
    deadline?: number;
  }) {
    Object.assign(this, init);
  }
}

class Todo {
  items: Record<string, TodoItem> = {};

  /** 添加待办 */
  addTodo(todo: { content: string; catalogId: string; deadline?: number }) {
    const todoItem = new TodoItem({
      id: uuidV4(),
      catalogId: todo.catalogId,
      createTime: Date.now(),
      content: todo.content,
      deadline: todo.deadline,
    });
    this.items[todoItem.id] = todoItem;

    catalog.addTodo(todoItem.catalogId, todoItem.id);
  }

  /** 修改待办 */
  modifyTodo(todo: {
    id: string;
    content?: string;
    deadline?: number;
    catalogId?: string;
  }) {
    const todoItem = this.items[todo.id];
    if (todoItem) {
      todoItem.content = todo.content ?? todoItem.content;
      todoItem.deadline = todo.deadline ?? todoItem.deadline;
      // 移动分类
      if (todo.catalogId && todo.catalogId !== todoItem.catalogId) {
        // 原分类删除
        catalog.deleteTodo(todoItem.catalogId, todo.id);
        // 新分类添加
        catalog.addTodo(todo.catalogId, todo.id);
        // todo自身
        todoItem.catalogId = todo.catalogId;
      }
    }
  }

  /** 完成待办 */
  completeTodo(todoId: string) {
    const todoItem = this.items[todoId];
    if (todoItem) {
      todoItem.doneTime = Date.now();
    }
  }

  /** 取消完成待办 */
  unCompleteTodo(todoId: string) {
    const todoItem = this.items[todoId];
    if (todoItem) {
      delete todoItem.doneTime;
    }
  }

  /** 删除待办 */
  deleteTodo(todoId: string, catalogId: string) {
    delete this.items[todoId];
    catalog.deleteTodo(catalogId, todoId);
  }
}

export const todo = createStore(new Todo());
