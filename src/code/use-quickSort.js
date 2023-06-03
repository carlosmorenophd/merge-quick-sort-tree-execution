import dataTree from "data-tree";
import { uid } from "uid";

const useQuickSort = () => {
  const parent = uid();
  let tree = [];

  const quickSort = (data) => {
    return quickSortImplementation({ arr: data, parent });
  };

  const quickSortImplementation = ({ arr, parent }) => {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];

    const leaf = {
      parent,
      id: uid(),
      name: "main",
      pivot,
      element: arr,
      right,
      left,
    };
    tree.push(leaf);
    let lastId;
    arr.forEach((element, index) => {
      if (index === Math.floor(arr.length / 2)) {
        return;
      }
      element < pivot ? left.push(element) : right.push(element);
      lastId = uid();
      const leafMove = {
        parent,
        id: lastId,
        name: "sort",
        pivot: "",
        right,
        left,
      };
      tree.push(leafMove);
    });
    return [
      ...quickSortImplementation({ arr: left, parent: lastId }),
      pivot,
      ...quickSortImplementation({ arr: right, parent: lastId }),
    ];
  };

  const getTree = () => {
    if (tree.length === 0) {
      throw new Error(
        "The quick sort function must be called before get tree function!"
      );
    } else {
      return getTreeImplementation().export((data) => {
        return {
          name: `${data.values.id}`,
          attributes: {
            tag:
              data.values.name === "main"
                ? `${data.values.name} -(${
                    data.values.pivot
                  }) [${data.values.element.join(",")}]`
                : `${data.values.name} -(${
                    data.values.pivot
                  }) [${data.values.right.join(",")}] [${data.values.left.join(
                    ","
                  )}]`,
          },
        };
      });
    }
  };

  const getTreeImplementation = () => {
    let nowParent = parent;
    const oldParent = parent;
    let continueTree = true;
    let panicButton = 0;
    let dataTreeResult = dataTree.create();
    let finishAllLeaf = 1;
    let parentCollectors = [];
    while (continueTree) {
      const nowParentConst = nowParent;
      const children = tree.filter((t) => t.parent === nowParentConst);
      children.forEach((child) => {
        parentCollectors.push(child.id);
        if (child.parent === oldParent) {
          dataTreeResult.insert({
            key: child.id,
            values: {
              id: child.id,
              name: child.name,
              element: child.element,
              pivot: child.pivot,
              type: "Parent",
              right: child.right,
              left: child.left,
            },
          });
        } else {
          dataTreeResult.insertTo((data) => data.key === nowParentConst, {
            key: child.id,
            values: {
              id: child.id,
              name: child.name,
              element: child.element,
              pivot: child.pivot,
              type: "Child",
              right: child.right,
              left: child.left,
            },
          });
        }
      });
      finishAllLeaf = finishAllLeaf + children.length;
      nowParent = parentCollectors.pop();
      if (finishAllLeaf === 0) continueTree = false;
      finishAllLeaf--;

      // Panic button to prevent infinite loop only on dev mode
      if (process.env.NODE_ENV === "development") {
        if (panicButton > 100) {
          console.warn("Panic button activate");
          continueTree = false;
        } else {
          panicButton++;
        }
      }
    }
    return dataTreeResult;
  };

  return {
    getTree,
    quickSort,
  };
};

export { useQuickSort };
