import { configureStore } from "@reduxjs/toolkit";
// Reducers
import tasks from '../features/tasks/taskSlice'
import dialogs from '../features/dialogs/dialogSlice'

export const store = configureStore({
  reducer: {
    tasks,
    dialogs,
  },
});
