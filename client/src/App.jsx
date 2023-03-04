import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Grid from "@mui/material/Unstable_Grid2";
import { Divider, Typography } from "@mui/material";
import TasksListView from "./components/TasksListView";
import DeleteDialog from "./components/DeleteDialog";
import TaskDetailsView from "./components/TaskDetailsView";
import TopBar from "./components/TopBar";
import CreateUpdateDialog from "./components/CreateUpdateDialog";
// Redux
import { fetchAllTasks } from "./features/tasks/taskSlice";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const [taskDeletedID, setTaskDeletedID] = useState();

  const { selectedTask } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  // Request to get all tasks
  useEffect(() => {
    dispatch(fetchAllTasks());
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TopBar />
      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
      >
        <TasksListView setTaskDeletedID={setTaskDeletedID} />
        <Divider orientation="vertical" variant="middle" flexItem />
        {Object.keys(selectedTask).length ? (
          <TaskDetailsView />
        ) : (
          <Typography variant="h5" component="div" color="text.secondary">
            Select a task
          </Typography>
        )}
      </Grid>
      <DeleteDialog taskDeletedID={taskDeletedID} />
      <CreateUpdateDialog />
    </LocalizationProvider>
  );
}
