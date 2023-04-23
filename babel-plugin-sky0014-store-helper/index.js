const { pathResolve, pathNormalize } = require("./util");

const LIB = "@sky0014/store";
const CREATE_STORE = "createStore";
const OBSERVE = "observe";

const _hooksWatched = [
  "useEffect",
  "useLayoutEffect",
  "useCallback",
  "useMemo",
  "useImperativeHandle",
];

module.exports = function (
  { assertVersion, types: t, template },
  options = {
    hooksWatched: {},
  }
) {
  assertVersion(7);

  // options
  const hooksWatched = { ..._hooksWatched, ...options.hooksWatched };

  // const
  const jsxMap = {};
  const storeMap = {};
  const observeImport = template.ast(`import { ${OBSERVE} } from "${LIB}";`);

  // utils
  function findObserve(path) {
    const binding = path.scope.getBinding(OBSERVE);
    if (binding) {
      const statement = binding.path.getStatementParent();
      if (t.isStringLiteral(statement.node.source, { value: LIB })) {
        return true;
      }
    }
    return false;
  }

  // Fc = xxx -> Fc = observe(xxx)
  function transformCommon(path) {
    const node = t.callExpression(t.identifier(OBSERVE), [path.node]);
    path.replaceWith(node);
  }

  // function Fc() { ... } -> const Fc = observe(function () {...})
  // export default function Fc -> export default observe(function Fc)
  function transformFunctionDeclaration(path) {
    const parentPath = path.getStatementParent();
    if (t.isExportDefaultDeclaration(parentPath)) {
      // export default can't use const Fc = ..., change it to export default observe(function Fc)
      const node = t.callExpression(t.identifier(OBSERVE), [
        t.functionExpression(path.node.id, path.node.params, path.node.body),
      ]);
      path.replaceWith(node);
      return;
    }

    const name = path.node.id.name;
    const node = t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier(name),
        t.callExpression(t.identifier(OBSERVE), [
          t.functionExpression(null, path.node.params, path.node.body),
        ])
      ),
    ]);
    path.replaceWith(node);
  }

  function transformToObserve(path) {
    if (!path || !path.node) {
      return;
    }

    try {
      if (t.isFunctionDeclaration(path)) {
        transformFunctionDeclaration(path);
      } else if (t.isVariableDeclaration(path)) {
        transformToObserve(path.get("declarations.0"));
      } else if (t.isVariableDeclarator(path)) {
        transformCommon(path.get("init"));
      } else {
        transformCommon(path);
      }
    } catch (e) {
      debugger;
    }
  }

  function isStore(path, name) {
    return storeMap[name];
  }

  function addObserveImport(path, state) {
    if (!findObserve(path)) {
      state.file.path.pushContainer("body", observeImport);
    }
  }

  return {
    name: "sky0014-store-helper",

    visitor: {
      // get all jsx element
      JSXOpeningElement(path, state) {
        const name = path.node.name.name;
        const binding = path.scope.getBinding(name);
        if (binding) {
          const importer = binding.path.parent;
          if (importer && t.isImportDeclaration(importer)) {
            const importFile = pathResolve(
              state.filename,
              importer.source.value
            );
            const arr = [];
            for (let node of importer.specifiers) {
              if (node.local.name === name) {
                if (t.isImportDefaultSpecifier(node)) {
                  arr.push("default");
                } else {
                  arr.push(node.imported.name);
                }
                break;
              }
            }
            jsxMap[importFile] = arr;
          }
        }
      },

      FunctionDeclaration(path, state) {
        path.traverse({
          MemberExpression(path2, state) {
            if (t.isCallExpression(path2.parentPath)) {
              // store.action(...) ignored
              return;
            }

            const object = path2.get("object");
            if (t.isIdentifier(object)) {
              const name = object.node.name;
              if (isStore(object, name)) {
                console.log(`function: ${path}`);
                console.log(`use store: ${object.node.name}`);
                path2.stop();
              }
            }
          },
        });
      },

      // export { Fc }
      // export { Fc as Fc2 }
      // export const Fc = ...
      // export function Fc ...
      // find Fc declaration, wrap Fc with observe
      ExportNamedDeclaration(path, state) {
        const normalized = pathNormalize(state.filename);
        const arr = jsxMap[normalized];
        if (arr?.length) {
          // add import
          addObserveImport(path, state);

          arr.forEach((name) => {
            // export { Fc }
            // export { Fc as Fc2 }
            path.node.specifiers.forEach((node) => {
              if (t.isIdentifier(node.exported, { name })) {
                const localName = node.local.name;
                // find Fc declaration
                const binding = path.scope.getBinding(localName);
                if (binding) {
                  // wrap with observe
                  const fcPath = binding.path;
                  transformToObserve(fcPath);
                }
              }
            });

            // export const Fc = ...
            // export function Fc ...
            transformToObserve(path.get("declaration"));
          });
        }
      },

      // export default Fc --> export default observe(Fc)
      // export default function Fc --> export default observe(function Fc)
      ExportDefaultDeclaration(path, state) {
        const normalized = pathNormalize(state.filename);
        const arr = jsxMap[normalized];
        if (arr?.length) {
          const find = arr.find((name) => name === "default");
          if (find) {
            // add import
            addObserveImport(path, state);

            // wrap observe
            const declaration = path.get("declaration");
            transformToObserve(declaration);
          }
        }
      },

      CallExpression(path, state) {
        if (path.node.callee.name === CREATE_STORE) {
          const binding = path.scope.getBinding(CREATE_STORE);
          if (!binding) return;

          const importer = binding.path.parent;
          if (
            importer &&
            t.isImportDeclaration(importer) &&
            t.isStringLiteral(importer.source, { value: LIB })
          ) {
            const p = path.findParent((p) => t.isVariableDeclarator(p.node));
            if (p) {
              console.log(state.filename, "find store: ", p.node.id.name);
              storeMap[p.node.id.name] = true;
            }
          }
        }
      },
    },
  };
};
