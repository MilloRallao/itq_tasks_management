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

export default function UpdateDialog({
  openDialogUpdate,
  handleCloseDialog,
  taskSelected,
  setTaskSelected,
  taskErrors,
  setTaskErrors,
  taskHelperTexts,
  setTaskHelperTexts,
  setTasks,
  setAuxTasks,
}) {
  const { enqueueSnackbar } = useSnackbar();

  // Validate name field (Max 40 characters and not empty)
  const checkName = () => {
    if (
      "name" in taskSelected &&
      taskSelected.name.length <= 40 &&
      taskSelected.name.trim().length > 0
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
    } else if (taskSelected.name?.length > 40) {
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
      "description" in taskSelected &&
      taskSelected.description.length <= 250 &&
      taskSelected.description.trim().length > 0
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
    } else if (taskSelected.description?.length > 250) {
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
    if (moment(taskSelected.date).isValid()) {
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

  // Request to update a task
  const handleUpdateTask = async () => {
    const nameError = await checkName();
    const descriptionError = await checkDescription();
    const dateError = await checkDate();
    if (!nameError && !descriptionError && !dateError) {
      axios
        .put(`http://localhost:4000/${taskSelected.id}`, taskSelected)
        .then((response) => {
          setTasks(response.data.originalTasks);
          setAuxTasks(response.data.originalTasks);
          setTaskSelected(taskSelected);
          enqueueSnackbar("Task updated successfully", { variant: "success" });
          handleCloseDialog();
        })
        .catch((error) => {
          console.log("ERROR ON UPDATE TASK: ", error);
          enqueueSnackbar("Error while updating task", { variant: "error" });
        });
    }
  };

  return (
    <Dialog open={openDialogUpdate} onClose={handleCloseDialog}>
      <DialogTitle sx={{ textAlign: "center" }}>Update Task</DialogTitle>
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
          value={taskSelected.name}
          onChange={(e) => {
            setTaskSelected({
              ...taskSelected,
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
          value={taskSelected.description}
          fullWidth
          helperText={taskHelperTexts.description}
          placeholder="Some description"
          onChange={(e) => {
            setTaskSelected({
              ...taskSelected,
              description: e.target.value,
            });
          }}
        />
        {/* DATEPICKER */}
        <DesktopDatePicker
          label="Date"
          value={taskSelected.date}
          onChange={(newValue) => {
            setTaskSelected({
              ...taskSelected,
              date: moment(newValue).format("MMM, DD YYYY HH:mm").toString(),
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
          onClick={handleUpdateTask}
          color="success"
          variant="contained"
          autoFocus
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
