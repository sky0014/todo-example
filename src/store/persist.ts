import { persist as storePersist } from "@sky0014/store";
import { catalog } from "src/store/catalog";
import { todo } from "src/store/todo";

export async function persist() {
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
