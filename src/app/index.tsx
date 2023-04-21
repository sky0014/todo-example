import React from "react";
import "./index.styl";
import Catalog from "src/app/component/catalog";
import { catalog } from "src/store/catalog";

function App() {
  console.log("render app");

  return (
    <div>
      {Object.values(catalog.items).map((catalog) => (
        <Catalog key={catalog.id} catalog={catalog} />
      ))}
    </div>
  );
}

export default App;
