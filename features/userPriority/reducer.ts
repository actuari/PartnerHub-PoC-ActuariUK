import { createAction, createReducer } from "@reduxjs/toolkit";
import { SET_PRIORITY } from "./action";
type UserType = "user" | "employer";
const defaultState: {
  priority: UserType;
} = {
  priority: "employer",
};

export const setPriority = createAction<UserType>(SET_PRIORITY);

export const priorityReducer = createReducer(defaultState, (builder) =>
  builder.addCase(setPriority, (state, action) => {
    state.priority = action.payload;
  })
);
