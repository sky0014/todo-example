import { persist as storePersist, serial } from "@sky0014/store";
import { catalog } from "src/store/catalog";
import { TodoItem, todo } from "src/store/todo";

export async function persist() {
  serial.register({ TodoItem });

  await storePersist(todo, {
    key: "todo",
    ver: 0,
    storage: localStorage,
  });
  await storePersist(catalog, {
    key: "catalog",
    ver: 0,
    storage: localStorage,
  });
}
