import React, { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import TasksListView from "./components/TasksListView";
import DeleteDialog from "./components/DeleteDialog";
import CreateDialog from "./components/CreateDialog";
import UpdateDialog from "./components/UpdateDialog";
import TaskDetailsView from "./components/TaskDetailsView";
import TopBar from "./components/TopBar";
import axios from "axios";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskSelected, setTaskSelected] = useState({});

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

  useEffect(() => {
    axios
      .get("http://localhost:4000/")
      .then((response) => {
        console.log(response);
        setTasks(response);
      })
      .catch((error) => {
        console.log("ERROR ON GET TASKS:", error);
      });
  }, []);

  const handleClickCreateTask = () => {
    setOpenDialogCreate(true);
  };

  const handleClickUpdateTask = () => {
    setOpenDialogUpdate(true);
  };

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
          tasks={tasks}
          setTasks={setTasks}
        />
      </LocalizationProvider>
    </SnackbarProvider>
  );
}
