import { createAction, createReducer } from "@reduxjs/toolkit";
import { SnackbarMessage } from "../../types/SnackbarMessage";
import { ADD_MESSAGE, CLEAR } from "./action";

const defaultState: {
  message: SnackbarMessage;
} = {
  message: {},
};

export const addMessage = createAction<SnackbarMessage>(ADD_MESSAGE);
export const clear = createAction(CLEAR);

export const messageReducer = createReducer(defaultState, (builder) =>
  builder
    .addCase(addMessage, (state, action) => {
      state.message = action.payload;
    })
    .addCase(clear, (state) => {
      state.message = {};
    })
);
