import React, { useState } from "react";
import "./App.css";
import { Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import TasksListView from "./components/TasksListView";
import DeleteDialog from "./components/DeleteDialog";
import CreateOrUpdateDialog from "./components/CreateOrUpdateDialog";
import TaskDetailsView from "./components/TaskDetailsView";
import TopBar from "./components/TopBar";

const tasks = [
  {
    id: 1,
    name: "Recoger la mierda del perro",
    description: "Recoger la caca de Luchi antes de que venga mi madre",
    completed: false,
    date: "Feb, 14 2023 12:00",
  },
  {
    id: 2,
    name: "Zacer los deberes",
    description: "Matemáticas, física y filosofía",
    completed: true,
    date: "Feb, 10 2023 12:00",
  },
  {
    id: 3,
    name: "Ir al médico",
    description: "Preguntar por análisis de sangre y el colesterol alto",
    completed: false,
    date: "Feb, 12 2023 12:00",
  },
];

export default function App() {
  const [updateOrCreate, setUpdateOrCreate] = useState("");
  const [taskSelected, setTaskSelected] = useState({
    id: null,
    name: "",
    description: "",
    completed: false,
    date: null,
  });
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogCreateOrUpdate, setOpenDialogCreateOrUpdate] = useState(false);
  const [taskNameHelperText, setTaskNameHelperText] = useState("");
  const [taskNameError, setTaskNameError] = useState(false);

  const handleClickCreateOrUpdateTask = (e) => {
    const { name } = e.target;
    setUpdateOrCreate(name || "Update");
    setOpenDialogCreateOrUpdate(true);
  };

  const handleCloseDialog = () => {
    setOpenDialogDelete(false);
    setOpenDialogCreateOrUpdate(false);
    setTaskNameHelperText("");
    setTaskNameError(false);
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
            taskSelected={taskSelected}
            setTaskSelected={setTaskSelected}
            handleClickCreateOrUpdateTask={handleClickCreateOrUpdateTask}
            setOpenDialogDelete={setOpenDialogDelete}
          />
          <Divider orientation="vertical" variant="middle" flexItem />
          <TaskDetailsView />
        </Grid>

        <DeleteDialog
          openDialogDelete={openDialogDelete}
          handleCloseDialog={handleCloseDialog}
        />
        <CreateOrUpdateDialog
          openDialogCreateOrUpdate={openDialogCreateOrUpdate}
          handleCloseDialog={handleCloseDialog}
          updateOrCreate={updateOrCreate}
          taskNameError={taskNameError}
          taskNameHelperText={taskNameHelperText}
          taskSelected={taskSelected}
          setTaskSelected={setTaskSelected}
        />
      </LocalizationProvider>
    </SnackbarProvider>
  );
}
