import React from "react";
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

export default function CreateOrUpdateDialog({
  openDialogCreateOrUpdate,
  handleCloseDialog,
  updateOrCreate,
  taskNameError,
  taskNameHelperText,
  taskSelected,
  setTaskSelected,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateTask = () => {
    enqueueSnackbar("Task created successfully", { variant: "success" });
    handleCloseDialog();
  };

  const handleUpdateTask = () => {
    enqueueSnackbar("Task updated successfully", { variant: "success" });
    handleCloseDialog();
  };

  return (
    <Dialog open={openDialogCreateOrUpdate} onClose={handleCloseDialog}>
      <DialogTitle
        sx={{ textAlign: "center" }}
      >{`${updateOrCreate} Task`}</DialogTitle>
      <DialogContent>
        {/* NAME */}
        <TextField
          margin="normal"
          required
          error={taskNameError}
          label="Name"
          placeholder="Some title"
          type="text"
          fullWidth
          helperText={taskNameHelperText}
          variant="outlined"
          value={taskSelected?.name}
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
          multiline
          value={taskSelected?.description}
          fullWidth
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
          value={taskSelected?.date}
          disablePast
          onChange={(newValue) => {
            setTaskSelected({
              ...taskSelected,
              date: newValue,
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
          onClick={() =>
            updateOrCreate === "Create"
              ? handleCreateTask()
              : handleUpdateTask()
          }
          color="success"
          variant="contained"
          autoFocus
        >
          {updateOrCreate}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
