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

export default function UpdateDialog({
  openDialogUpdate,
  handleCloseDialog,
  taskSelected,
  setTaskSelected,
  taskErrors,
  setTaskErrors,
  taskHelperTexts,
  setTaskHelperTexts,
  tasks,
  setTasks,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [taskUpdated, setTaskUpdated] = useState(taskSelected);

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
  };

  const handleUpdateTask = () => {
    validations();
    if (!taskErrors.name && !taskErrors.description) {
      axios
        .put(`http:://localhost:4000/${taskUpdated.id}`, taskUpdated)
        .then((response) => {
          setTasks((prevState) => {
            let tasks = [...prevState];
            let taskUpdatedIndex = tasks.findIndex((task) => task.id === taskUpdated.id);
            tasks[taskUpdatedIndex].completed = !tasks[taskUpdatedIndex].completed;
            return tasks;
          });
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
          value={taskUpdated.name}
          onChange={(e) => {
            setTaskUpdated({
              ...taskUpdated,
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
          value={taskUpdated.description}
          fullWidth
          helperText={taskHelperTexts.description}
          placeholder="Some description"
          onChange={(e) => {
            setTaskUpdated({
              ...taskUpdated,
              description: e.target.value,
            });
          }}
        />
        {/* DATEPICKER */}
        <DesktopDatePicker
          label="Date"
          value={taskUpdated.date}
          disablePast
          onChange={(newValue) => {
            setTaskUpdated({
              ...taskUpdated,
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