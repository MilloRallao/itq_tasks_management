import React, { useEffect, useState } from "react";
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
// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../features/dialogs/dialogSlice";
import { fetchAddTask, fetchUpdateTask } from "../features/tasks/taskSlice";

export default function CreateUpdateDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    completed: false,
    date: moment(new Date()).format("MMM, DD YYYY HH:mm").toString(),
  });
  const [taskSelected, setTaskSelected] = useState({});
  const [taskErrors, setTaskErrors] = useState({
    name: undefined,
    description: undefined,
  });
  const [taskHelperTexts, setTaskHelperTexts] = useState({
    name: "",
    description: "",
  });

  const dialogOpen = useSelector((state) => state.dialogs["dialogCreateUpdate"]);
  const dialogType = useSelector((state) => state.dialogs.dialogType);
  const { selectedTask } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    setTaskSelected(selectedTask);
  }, [selectedTask]);

  // Validate name field (Max 40 characters and not empty)
  const checkName = () => {
    if (
      ("name" in newTask &&
        newTask.name.length <= 40 &&
        newTask.name.trim().length > 0) ||
      ("name" in taskSelected &&
        taskSelected.name.length <= 40 &&
        taskSelected.name.trim().length > 0)
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
    } else if (newTask.name?.length > 40 || taskSelected.name?.length > 40) {
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
      ("description" in taskSelected &&
        taskSelected.description.length <= 250 &&
        taskSelected.description.trim().length > 0)
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
      taskSelected.description?.length > 250
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
    if (moment(newTask.date).isValid() || moment(taskSelected.date).isValid()) {
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
      if (dialogType === "create") {
        dispatch(fetchAddTask(newTask));
        setNewTask({
          name: "",
          description: "",
          completed: false,
          date: moment(new Date()).format("MMM, DD YYYY HH:mm").toString(),
        });
        handleCloseDialog();
      } else if (dialogType === "update") {
        dispatch(fetchUpdateTask(taskSelected));
        handleCloseDialog();
      }
    }
  };

  // Handle closing dialog
  const handleCloseDialog = () => {
    dispatch(closeDialog("dialogCreateUpdate"));
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
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle sx={{ textAlign: "center" }}>
        {dialogType === "create" ? "Create" : "Update"} Task
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
          value={dialogType === "create" ? newTask.name : taskSelected.name}
          onChange={(e) => {
            dialogType === "create"
              ? setNewTask({
                  ...newTask,
                  name: e.target.value,
                })
              : setTaskSelected({
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
          value={
            dialogType === "create"
              ? newTask.description
              : taskSelected.description
          }
          fullWidth
          helperText={taskHelperTexts.description}
          placeholder="Some description"
          onChange={(e) => {
            dialogType === "create"
              ? setNewTask({
                  ...newTask,
                  description: e.target.value,
                })
              : setTaskSelected({
                  ...taskSelected,
                  description: e.target.value,
                });
          }}
        />
        {/* DATEPICKER */}
        <DesktopDatePicker
          label="Date"
          value={dialogType === "create" ? newTask.date : taskSelected.date}
          onChange={(newValue) => {
            dialogType === "create"
              ? setNewTask({
                  ...newTask,
                  date: moment(newValue)
                    .format("MMM, DD YYYY HH:mm")
                    .toString(),
                })
              : setTaskSelected({
                  ...taskSelected,
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
          {dialogType === "create" ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
