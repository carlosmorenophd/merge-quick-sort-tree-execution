import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

export const SortForm = ({ onChange, value }) => {
  return (
    <FormControl fullWidth>
        <InputLabel id="sort-label" >Select sort method</InputLabel>
      <Select
        labelId="sort-label"
        name="sortSelect"
        onChange={onChange}
        label="Select sort method"
        value={value}
      >
        <MenuItem value={1}>Merge Sort</MenuItem>
        <MenuItem value={2}>Quick Sort</MenuItem>
      </Select>
    </FormControl>
  );
};
