import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./features/responseSnackbar/reducer";
import { priorityReducer } from "./features/userPriority/reducer";

export const reducer = combineReducers({
  messageReducer,
  priorityReducer,
});
export const store = configureStore({
  reducer: reducer,
});
export type RootState = ReturnType<typeof store.getState>;
