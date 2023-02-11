import React from "react";
import { useSnackbar } from "notistack";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function DeleteDialog({ openDialogDelete, handleCloseDialog }) {
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteTask = () => {
    enqueueSnackbar("Task deleted successfully", { variant: "success" });
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
