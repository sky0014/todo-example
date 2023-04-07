import { v4 as uuidV4 } from "uuid";
import { createStore } from "@sky0014/store";

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  todos: string[];
}

class Catalog {
  items: Record<string, CatalogItem> = {};

  /** 添加分类 */
  add(catalog: { name: string; description: string }) {
    const catalogId = uuidV4();
    this.items[catalogId] = {
      id: catalogId,
      name: catalog.name,
      description: catalog.description,
      todos: [],
    };
  }

  /** 修改分类 */
  modify(catalog: { id: string; name?: string; description?: string }) {
    const item = this.items[catalog.id];
    if (item) {
      item.name = catalog.name ?? item.name;
      item.description = catalog.description ?? item.description;
    }
  }

  /** 删除分类 */
  delete(catalogId: string) {
    delete this.items[catalogId];
  }

  /** 分类添加todo */
  addTodo(catalogId: string, todoId: string) {
    const item = this.items[catalogId];
    if (item) {
      const index = item.todos.indexOf(todoId);
      if (index === -1) {
        item.todos.push(todoId);
      }
    }
  }

  /** 分类删除todo */
  deleteTodo(catalogId: string, todoId: string) {
    const item = this.items[catalogId];
    if (item) {
      const index = item.todos.indexOf(todoId);
      if (index !== -1) {
        item.todos.splice(index, 1);
      }
    }
  }
}

export function setDefaultCatalog() {
  catalog.add({
    name: "重要且紧急",
    description: "第一象限，立即去做",
  });
  catalog.add({
    name: "重要但不紧急",
    description: "第二象限，有计划去做",
  });
  catalog.add({
    name: "紧急但不重要",
    description: "第三象限，授权或委婉拒绝",
  });
  catalog.add({
    name: "不紧急且不重要",
    description: "第四象限，尽量别做",
  });
}

export const catalog = createStore(new Catalog());
