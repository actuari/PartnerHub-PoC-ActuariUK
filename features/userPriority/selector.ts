import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const prioritySelector = createSelector(
  (state: RootState) => state.priorityReducer,
  (priorityReducer) => priorityReducer.priority
);
