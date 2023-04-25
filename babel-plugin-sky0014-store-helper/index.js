const LIB = "@sky0014/store";
const OBSERVE = "__observe";

const _hooksWatched = [
  "useEffect",
  "useLayoutEffect",
  "useCallback",
  "useMemo",
  "useImperativeHandle",
];

module.exports = function (
  { assertVersion, types: t, template },
  options = {}
) {
  assertVersion(7);

  // options
  const hooksWatched = new Set(
    options.hooksWatched
      ? [..._hooksWatched, ...options.hooksWatched]
      : _hooksWatched
  );

  // const
  const observeImport = template.ast(
    `import { observe as ${OBSERVE} } from "${LIB}";`
  );
  const observeComponent = template(
    `const %%name%% = ${OBSERVE}(%%Component%%);`
  );

  // xxx -> observe(xxx)
  function transformToObserve(path) {
    const node = t.callExpression(t.identifier(OBSERVE), [path.node]);
    path.replaceWith(node);
  }

  function addObserveImport(path, state) {
    const program = state.file.path;
    const binding = program.scope.getBinding(OBSERVE);
    if (!binding) {
      program.node.body.unshift(observeImport);
    }
  }

  return {
    name: "sky0014-store-helper",

    visitor: {
      Program: {
        exit(path, state) {
          if (this.shouldImportObserve) {
            addObserveImport(path, state);
          }
        },
      },

      // observe all jsx element (except `div` `canvas` etc...)
      JSXElement(path, state) {
        const program = state.file.path;
        const name = path.node.openingElement.name.name;
        const binding = program.scope.getBinding(name);
        if (binding) {
          const observedName = `__Observed_${name}`;
          const observedBinding = program.scope.getBinding(observedName);
          if (!observedBinding) {
            // do observe
            this.shouldImportObserve = true;

            const node = observeComponent({
              name: observedName,
              Component: name,
            });
            program.node.body.unshift(node);
          }
          // replace with observed component
          path.node.openingElement.name.name = observedName;
          if (path.node.closingElement) {
            path.node.closingElement.name.name = observedName;
          }
        }
      },

      // watched hooks add observe
      CallExpression(path, state) {
        const callee = path.get("callee");
        if (t.isIdentifier(callee)) {
          const callName = callee.node.name;
          if (hooksWatched.has(callName)) {
            // should observe
            this.shouldImportObserve = true;

            const arguments = path.get("arguments");
            const last = arguments[arguments.length - 1];
            if (t.isArrayExpression(last)) {
              const elements = last.get("elements");
              elements.forEach(transformToObserve);
            }
          }
        }
      },
    },
  };
};
