import React, { useState } from "react";
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

export default function CreateDialog({
  openDialogCreate,
  handleCloseDialog,
  taskErrors,
  setTaskErrors,
  taskHelperTexts,
  setTaskHelperTexts,
  setTasks,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    completed: false,
    date: moment(new Date()).format("MMM, DD YYYY HH:mm").toString(),
  });

  const checkName = () => {
    if (
      "name" in newTask &&
      newTask.name.length <= 40 &&
      newTask.name.trim().length > 0
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
    } else if (newTask.name?.length > 40) {
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
    }
  };

  const checkDescription = () => {
    if (
      "description" in newTask &&
      newTask.description.length <= 250 &&
      newTask.description.trim().length > 0
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
    } else if (newTask.description?.length > 250) {
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
    }
  };

  const validations = () => {
    checkName();
    checkDescription();
  }

  const handleCreateTask = () => {
    validations();
    if (!taskErrors.name && !taskErrors.description) {
      axios
        .post("/create", newTask)
        .then((response) => {
          setTasks((prevState) => {
            return {
              ...prevState,
              newTask,
            };
          });
          enqueueSnackbar("Task created successfully", { variant: "success" });
          handleCloseDialog();
        })
        .catch((error) => {
          console.log("ERROR ON CREATE TASK: ", error);
          enqueueSnackbar("Error while creating task", { variant: "error" });
        });
    }
  };

  return (
    <Dialog open={openDialogCreate} onClose={handleCloseDialog}>
      <DialogTitle sx={{ textAlign: "center" }}>Create Task</DialogTitle>
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
          value={newTask.name}
          onChange={(e) => {
            setNewTask({
              ...newTask,
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
          value={newTask.description}
          fullWidth
          helperText={taskHelperTexts.description}
          placeholder="Some description"
          onChange={(e) => {
            setNewTask({
              ...newTask,
              description: e.target.value,
            });
          }}
        />
        {/* DATEPICKER */}
        <DesktopDatePicker
          label="Date"
          value={newTask.date}
          disablePast
          onChange={(newValue) => {
            setNewTask({
              ...newTask,
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
          onClick={handleCreateTask}
          color="success"
          variant="contained"
          autoFocus
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
