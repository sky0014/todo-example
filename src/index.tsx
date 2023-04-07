import React from "react";
import { createRoot } from "react-dom/client";
import logger from "@sky0014/logger";
import App from "src/app";
import { persist } from "src/store/persist";
import { setDefaultCatalog } from "src/store/catalog";

async function main() {
  logger.initLogger({
    prefix: "todo",
    enable: true,
  });

  await persist();

  // check first time run
  const FIRST_TIME_RUNED = "first_time_runed";
  if (!localStorage.getItem(FIRST_TIME_RUNED)) {
    setDefaultCatalog();
    localStorage.setItem(FIRST_TIME_RUNED, "true");
  }

  // render
  const root = document.getElementById("app");
  if (root) {
    createRoot(root).render(<App />);
  }
}

main();
