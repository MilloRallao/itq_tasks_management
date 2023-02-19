import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Grid from "@mui/material/Unstable_Grid2";
import { Divider, Typography } from "@mui/material";
import TasksListView from "./components/TasksListView";
import DeleteDialog from "./components/DeleteDialog";
import TaskDetailsView from "./components/TaskDetailsView";
import TopBar from "./components/TopBar";
import CreateUpdateDialog from "./components/CreateUpdateDialog";

export default function App() {
  const [requestType, setRequestType] = useState("");
  const [tasks, setTasks] = useState([]);
  const [auxTasks, setAuxTasks] = useState([]);
  const [taskSelected, setTaskSelected] = useState({});
  const [auxTaskSelected, setAuxTaskSelected] = useState({});
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    completed: false,
    date: moment(new Date()).format("MMM, DD YYYY HH:mm").toString(),
  });

  const [taskDeletedID, setTaskDeletedID] = useState();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const [taskErrors, setTaskErrors] = useState({
    name: undefined,
    description: undefined,
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
        setAuxTasks(response.data);
      })
      .catch((error) => {
        console.log("ERROR ON GET TASKS:", error);
      });
  }, []);

  // Open dialog form to create a task
  const handleClickCreateTask = () => {
    setRequestType("create");
    setNewTask({
      name: "",
      description: "",
      completed: false,
      date: moment(new Date()).format("MMM, DD YYYY HH:mm").toString(),
    });
    setOpenDialog(true);
  };

  // Open dialog form to update a task
  const handleClickUpdateTask = () => {
    setRequestType("update");
    setAuxTaskSelected(taskSelected);
    setOpenDialog(true);
  };

  // Handle closing dialogs and resets errors
  const handleCloseDialog = () => {
    setOpenDialogDelete(false);
    setOpenDialog(false);
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
            auxTasks={auxTasks}
            setAuxTasks={setAuxTasks}
            taskSelected={taskSelected}
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
          setAuxTasks={setAuxTasks}
          setTaskSelected={setTaskSelected}
          taskDeletedID={taskDeletedID}
          openDialogDelete={openDialogDelete}
          handleCloseDialog={handleCloseDialog}
        />
        <CreateUpdateDialog
          requestType={requestType}
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          taskErrors={taskErrors}
          setTaskErrors={setTaskErrors}
          taskHelperTexts={taskHelperTexts}
          setTaskHelperTexts={setTaskHelperTexts}
          setTasks={setTasks}
          setAuxTasks={setAuxTasks}
          newTask={newTask}
          setNewTask={setNewTask}
          setTaskSelected={setTaskSelected}
          auxTaskSelected={auxTaskSelected}
          setAuxTaskSelected={setAuxTaskSelected}
        />
      </LocalizationProvider>
    </SnackbarProvider>
  );
}
