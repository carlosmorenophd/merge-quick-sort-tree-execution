import dataTree from "data-tree";
import { uid } from "uid";

const useMergeSort = () => {
  const parent = uid();
  let tree = [];

  const mergeSort = (arr) => {
    return mergeSortImplementation({ arr, parent });
  };
  const mergeSortImplementation = ({ arr, parent }) => {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const leftHalf = arr.slice(0, mid);
    const rightHalf = arr.slice(mid);

    const leaf = {
      parent,
      id: uid(),
      name: "split",
      element: arr,
      right: leftHalf,
      left: rightHalf,
    };
    tree.push(leaf);
    const sortedLeftHalf = mergeSortImplementation({
      arr: leftHalf,
      parent: leaf.id,
    });
    const sortedRightHalf = mergeSortImplementation({
      arr: rightHalf,
      parent: leaf.id,
    });

    return merge({ left: sortedLeftHalf, right: sortedRightHalf });
  };

  const merge = ({ left, right }) => {
    const merged = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] <= right[rightIndex]) {
        merged.push(left[leftIndex++]);
      } else {
        merged.push(right[rightIndex++]);
      }
    }

    return merged.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };

  const getTree = () => {
    if (tree.length === 0) {
      throw new Error(
        "The merge sort function must be called before get tree function!"
      );
    } else {
      console.log(tree);
      return getTreeImplementation().export((data) => {
        return {
          name: `${data.values.id}`,
          attributes: {
            tag: `left: [${data.values.left}] - right[${data.values.right}]`,
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
    mergeSort,
    getTree,
  };
  //   // Example usage:
  //   const myArray = [7, 2, 1, 6, 8, 5, 3, 4];
  //   const sortedArray = mergeSort(myArray);
  //   console.log(sortedArray);
};

export { useMergeSort };
