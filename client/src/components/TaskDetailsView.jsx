import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { openDialog, setDialogType } from "../features/dialogs/dialogSlice";

export default function TaskDetailsView() {
  const dispatch = useDispatch();
  const { selectedTask } = useSelector((state) => state.tasks);

  // Open dialog form to update a task
  const handleClickUpdateTask = () => {
    dispatch(setDialogType("update"));
    dispatch(openDialog("dialogCreateUpdate"));
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {selectedTask.date}
        </Typography>
        <Typography variant="h5" component="div">
          {selectedTask.name}
        </Typography>
        <Typography
          sx={{ mb: 1.5, fontSize: 14 }}
          color={selectedTask.completed ? "primary" : "error"}
        >
          {selectedTask.completed ? "Completed" : "Incompleted"}
        </Typography>
        <Typography variant="body2">{selectedTask.description}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          name="Update"
          variant="contained"
          color="primary"
          endIcon={<Edit />}
          onClick={handleClickUpdateTask}
        >
          Update
        </Button>
      </CardActions>
    </Card>
  );
}
