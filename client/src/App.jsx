import React, { useEffect, useState } from "react";
import axios from "axios";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Grid from "@mui/material/Unstable_Grid2";
import { Divider, Typography } from "@mui/material";
import TasksListView from "./components/TasksListView";
import DeleteDialog from "./components/DeleteDialog";
import CreateDialog from "./components/CreateDialog";
import UpdateDialog from "./components/UpdateDialog";
import TaskDetailsView from "./components/TaskDetailsView";
import TopBar from "./components/TopBar";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskSelected, setTaskSelected] = useState({});

  const [taskDeletedID, setTaskDeletedID] = useState();

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogCreate, setOpenDialogCreate] = useState(false);
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false);

  const [taskErrors, setTaskErrors] = useState({
    name: true,
    description: true,
  });
  const [taskHelperTexts, setTaskHelperTexts] = useState({
    name: "",
    description: "",
  });

  // Request to get all tasks
  useEffect(() => {
    axios
      .get("http://localhost:4000/")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log("ERROR ON GET TASKS:", error);
      });
  }, []);

  // Open dialog form to create a task
  const handleClickCreateTask = () => {
    setOpenDialogCreate(true);
  };

  // Open dialog form to update a task
  const handleClickUpdateTask = () => {
    setOpenDialogUpdate(true);
  };

  // Handle closing dialogs and resets errors
  const handleCloseDialog = () => {
    setOpenDialogDelete(false);
    setOpenDialogCreate(false);
    setOpenDialogUpdate(false);
    setTaskErrors({
      name: false,
      description: false,
    });
    setTaskHelperTexts({
      name: "",
      description: "",
    });
  };

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <TopBar />
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          spacing={2}
        >
          <TasksListView
            tasks={tasks}
            setTasks={setTasks}
            setTaskSelected={setTaskSelected}
            handleClickCreateTask={handleClickCreateTask}
            setOpenDialogDelete={setOpenDialogDelete}
            setTaskDeletedID={setTaskDeletedID}
          />
          <Divider orientation="vertical" variant="middle" flexItem />
          {Object.keys(taskSelected).length ? (
            <TaskDetailsView
              taskSelected={taskSelected}
              handleClickUpdateTask={handleClickUpdateTask}
            />
          ) : (
            <Typography variant="h5" component="div" color="text.secondary">
              Select a task
            </Typography>
          )}
        </Grid>

        <DeleteDialog
          setTasks={setTasks}
          taskDeletedID={taskDeletedID}
          openDialogDelete={openDialogDelete}
          handleCloseDialog={handleCloseDialog}
        />
        <CreateDialog
          openDialogCreate={openDialogCreate}
          handleCloseDialog={handleCloseDialog}
          taskErrors={taskErrors}
          setTaskErrors={setTaskErrors}
          taskHelperTexts={taskHelperTexts}
          setTaskHelperTexts={setTaskHelperTexts}
          setTasks={setTasks}
        />
        <UpdateDialog
          openDialogUpdate={openDialogUpdate}
          handleCloseDialog={handleCloseDialog}
          taskErrors={taskErrors}
          setTaskErrors={setTaskErrors}
          taskHelperTexts={taskHelperTexts}
          setTaskHelperTexts={setTaskHelperTexts}
          taskSelected={taskSelected}
          setTaskSelected={setTaskSelected}
          setTasks={setTasks}
        />
      </LocalizationProvider>
    </SnackbarProvider>
  );
}
