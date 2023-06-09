import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ListData } from "./ListData";
import { SortForm } from "./SortForm";
import FilterListSharpIcon from "@mui/icons-material/FilterListSharp";
import { useQuickSort } from "../code/use-quickSort";
import { Result } from "./Result";
import Tree from "react-d3-tree";
import { useMergeSort } from "../code/use-mergeSort";

const BodyUi = (props) => {
  const [data, setData] = useState([6, 7, 8, 9, 5, 1, 2, 3, 4]);
  const [sort, setSort] = useState(1);
  const [result, setResult] = useState([]);
  const [tree, setTree] = useState({
    name: "Sort",
    attributes: {
      tag: "Parent",
    },
    children: [],
  });

  const handleChangeValue = (event) => {
    console.log(event.target.name, event.target.valueAsNumber);
    setData((prev) =>
      prev.map((cell, cellIndex) =>
        cellIndex === parseInt(event.target.name)
          ? event.target.valueAsNumber
          : cell
      )
    );
  };

  const handleAdd = () => {
    setData((prev) => {
      let newData = prev;
      newData.push(0);
      return newData.map((d) => d);
    });
  };

  const handleRemove = () => {
    setData((prev) => {
      let newData = prev;
      newData.pop();
      return newData.map((d) => d);
    });
  };

  const handleSort = (event) => {
    setSort(event.target.value);
  };

  const { quickSort, getTree: getTreeQuick } = useQuickSort();
  const { mergeSort, getTree: getTreeMerge } = useMergeSort();
  const handleResult = () => {
    if (sort === 2) {
      setResult(quickSort(data));
      setTree(getTreeQuick());
    } else if (sort === 1) {
      setResult(mergeSort(data));
      setTree(getTreeMerge());
    }
  };
  return (
    <Box sx={{ m: 1, p: 2, height: "100%" }} minHeight="100%">
      <Typography variant="body1" component="div">
        Data:
      </Typography>
      <Box>
        <ListData
          data={data}
          onChangeValue={handleChangeValue}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <SortForm onChange={handleSort} value={sort} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          endIcon={<FilterListSharpIcon />}
          onClick={handleResult}
        >
          Sort
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Result data={result} />
      </Box>
      <Box sx={{ height: "100%" }} minHeight="100%">
        <Tree
          data={tree}
          orientation="vertical"
          nodeSize={{ x: 200, y: 200 }}
        />
      </Box>
    </Box>
  );
};

export default BodyUi;
