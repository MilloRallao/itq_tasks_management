import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../features/dialogs/dialogSlice";
import { fetchDeleteTask } from "../features/tasks/taskSlice";

export default function DeleteDialog({ taskDeletedID }) {
  const dialogOpen = useSelector((state) => state.dialogs["dialogDelete"]);
  const dispatch = useDispatch();

  // Request to delete a task
  const handleDeleteTask = () => {
    dispatch(fetchDeleteTask(taskDeletedID));
    handleCloseDialog();
  };

  // Handle closing dialog
  const handleCloseDialog = () => {
    dispatch(closeDialog("dialogDelete"));
  };

  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
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
