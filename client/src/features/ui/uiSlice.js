import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {},
});

export default uiSlice.reducer;