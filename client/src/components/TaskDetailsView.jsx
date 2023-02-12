import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";

export default function TaskDetailsView({
  taskSelected,
  handleClickUpdateTask,
}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {taskSelected.date}
        </Typography>
        <Typography variant="h5" component="div">
          {taskSelected.name}
        </Typography>
        <Typography sx={{ mb: 1.5, fontSize: 14 }} color={taskSelected.completed ? "primary" : "error"}>
          {taskSelected.completed ? "Completed" : "Uncompleted"}
        </Typography>
        <Typography variant="body2">{taskSelected.description}</Typography>
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
