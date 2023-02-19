import React from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";

export default function CreateUpdateDialog({
  requestType,
  openDialog,
  handleCloseDialog,
  taskErrors,
  setTaskErrors,
  taskHelperTexts,
  setTaskHelperTexts,
  setTasks,
  setAuxTasks,
  newTask,
  setNewTask,
  setTaskSelected,
  auxTaskSelected,
  setAuxTaskSelected,
}) {
  const { enqueueSnackbar } = useSnackbar();

  // Validate name field (Max 40 characters and not empty)
  const checkName = () => {
    if (
      ("name" in newTask &&
        newTask.name.length <= 40 &&
        newTask.name.trim().length > 0) ||
      ("name" in auxTaskSelected &&
        auxTaskSelected.name.length <= 40 &&
        auxTaskSelected.name.trim().length > 0)
    ) {
      setTaskErrors((prevState) => {
        return {
          description: prevState.description,
          name: false,
        };
      });
      setTaskHelperTexts((prevState) => {
        return {
          description: prevState.description,
          name: "",
        };
      });
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    } else if (newTask.name?.length > 40 || auxTaskSelected.name?.length > 40) {
      setTaskErrors((prevState) => {
        return {
          description: prevState.description,
          name: true,
        };
      });
      setTaskHelperTexts((prevState) => {
        return {
          description: prevState.description,
          name: "Task name too long. Max 40 characters",
        };
      });
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    } else {
      setTaskErrors((prevState) => {
        return {
          description: prevState.description,
          name: true,
        };
      });
      setTaskHelperTexts((prevState) => {
        return {
          description: prevState.description,
          name: "Please, insert a task name",
        };
      });
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  };

  // Validate description field (Max 250 characters and not empty)
  const checkDescription = () => {
    if (
      ("description" in newTask &&
        newTask.description.length <= 250 &&
        newTask.description.trim().length > 0) ||
      ("description" in auxTaskSelected &&
        auxTaskSelected.description.length <= 250 &&
        auxTaskSelected.description.trim().length > 0)
    ) {
      setTaskErrors((prevState) => {
        return {
          name: prevState.name,
          description: false,
        };
      });
      setTaskHelperTexts((prevState) => {
        return {
          name: prevState.name,
          description: "",
        };
      });
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    } else if (
      newTask.description?.length > 250 ||
      auxTaskSelected.description?.length > 250
    ) {
      setTaskErrors((prevState) => {
        return {
          name: prevState.name,
          description: true,
        };
      });
      setTaskHelperTexts((prevState) => {
        return {
          name: prevState.name,
          description: "Task description too long. Max 250 characters",
        };
      });
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    } else {
      setTaskErrors((prevState) => {
        return {
          name: prevState.name,
          description: true,
        };
      });
      setTaskHelperTexts((prevState) => {
        return {
          name: prevState.name,
          description: "Please, insert a task description",
        };
      });
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  };

  // Validate date field
  const checkDate = () => {
    if (
      moment(newTask.date).isValid() ||
      moment(auxTaskSelected.date).isValid()
    ) {
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    } else {
      enqueueSnackbar("Invalid date format", { variant: "error" });
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  };

  // Request to create a task
  const handleRequestTask = async () => {
    const nameError = await checkName();
    const descriptionError = await checkDescription();
    const dateError = await checkDate();
    if (!nameError && !descriptionError && !dateError) {
      if (requestType === "create") {
        axios
          .post("http://localhost:4000/create", newTask)
          .then((response) => {
            setTasks(response.data);
            setAuxTasks(response.data);
            enqueueSnackbar("Task created successfully", {
              variant: "success",
            });
            setNewTask({
              name: "",
              description: "",
              completed: false,
              date: moment(new Date()).format("MMM, DD YYYY HH:mm").toString(),
            });
            handleCloseDialog();
          })
          .catch((error) => {
            console.log("ERROR ON CREATE TASK: ", error);
            enqueueSnackbar("Error while creating task", { variant: "error" });
          });
      } else if (requestType === "update") {
        axios
          .put(`http://localhost:4000/${auxTaskSelected.id}`, auxTaskSelected)
          .then((response) => {
            setTasks(response.data.originalTasks);
            setAuxTasks(response.data.originalTasks);
            setAuxTaskSelected(auxTaskSelected);
            setTaskSelected(auxTaskSelected);
            enqueueSnackbar("Task updated successfully", {
              variant: "success",
            });
            handleCloseDialog();
          })
          .catch((error) => {
            console.log("ERROR ON UPDATE TASK: ", error);
            enqueueSnackbar("Error while updating task", { variant: "error" });
          });
      }
    }
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle sx={{ textAlign: "center" }}>
        {requestType === "create" ? "Create" : "Update"} Task
      </DialogTitle>
      <DialogContent>
        {/* NAME */}
        <TextField
          margin="normal"
          required
          error={taskErrors.name}
          label="Name"
          placeholder="Some title"
          type="text"
          fullWidth
          helperText={taskHelperTexts.name}
          variant="outlined"
          value={requestType === "create" ? newTask.name : auxTaskSelected.name}
          onChange={(e) => {
            requestType === "create"
              ? setNewTask({
                  ...newTask,
                  name: e.target.value,
                })
              : setAuxTaskSelected({
                  ...auxTaskSelected,
                  name: e.target.value,
                });
          }}
        />
        {/* DESCRIPTION */}
        <TextField
          margin="normal"
          label="Description"
          error={taskErrors.description}
          multiline
          value={
            requestType === "create"
              ? newTask.description
              : auxTaskSelected.description
          }
          fullWidth
          helperText={taskHelperTexts.description}
          placeholder="Some description"
          onChange={(e) => {
            requestType === "create"
              ? setNewTask({
                  ...newTask,
                  description: e.target.value,
                })
              : setAuxTaskSelected({
                  ...auxTaskSelected,
                  description: e.target.value,
                });
          }}
        />
        {/* DATEPICKER */}
        <DesktopDatePicker
          label="Date"
          value={requestType === "create" ? newTask.date : auxTaskSelected.date}
          onChange={(newValue) => {
            requestType === "create"
              ? setNewTask({
                  ...newTask,
                  date: moment(newValue)
                    .format("MMM, DD YYYY HH:mm")
                    .toString(),
                })
              : setAuxTaskSelected({
                  ...auxTaskSelected,
                  date: moment(newValue)
                    .format("MMM, DD YYYY HH:mm")
                    .toString(),
                });
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={handleCloseDialog} color="error" variant="contained">
          Cancel
        </Button>
        <Button
          onClick={handleRequestTask}
          color="success"
          variant="contained"
          autoFocus
        >
          {requestType === "create" ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
