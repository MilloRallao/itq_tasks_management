import React from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function DeleteDialog({ setTasks, setAuxTasks, setTaskSelected, taskDeletedID, openDialogDelete, handleCloseDialog }) {
  const { enqueueSnackbar } = useSnackbar();

  // Request to delete a task
  const handleDeleteTask = () => {
    axios
      .delete(`http://localhost:4000/${taskDeletedID}`)
      .then((response) => {
        setTasks(response.data);
        setAuxTasks(response.data);
        enqueueSnackbar("Task deleted successfully", { variant: "success" });
        setTaskSelected({});
      })
      .catch((error) => {
        console.log("ERROR DELETING TASK:", error);
        enqueueSnackbar("Error while deleting task", { variant: "error" });
      });
    handleCloseDialog();
  };

  return (
    <Dialog open={openDialogDelete} onClose={handleCloseDialog}>
      <DialogTitle sx={{ textAlign: "center" }}>Delete Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You will delete this task. Are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={handleCloseDialog} color="error" variant="contained">
          Disagree
        </Button>
        <Button
          onClick={handleDeleteTask}
          color="success"
          variant="contained"
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
