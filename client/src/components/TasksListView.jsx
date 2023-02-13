import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
  Button,
  Checkbox,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import PostAdd from "@mui/icons-material/PostAdd";
import SortByAlpha from "@mui/icons-material/SortByAlpha";
import DateRange from "@mui/icons-material/DateRange";
import Rule from "@mui/icons-material/Rule";

export default function TasksListView({
  tasks,
  setTasks,
  setTaskSelected,
  handleClickCreateTask,
  setOpenDialogDelete,
  setTaskDeletedID,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [sortingType, setSortingType] = useState("");

  // Request to get a task
  const handleSelectTask = (e) => {
    const { value } = e.target;
    axios
      .get(`http://localhost:4000/${value}`)
      .then((response) => {
        setTaskSelected(response.data[0]);
      })
      .catch((error) => {
        console.log("ERROR GETTING A TASK:", error);
      });
  };

  // Open dialog to confirm deleting a task
  const handleClickDeleteTask = (taskID) => {
    setTaskDeletedID(taskID);
    setOpenDialogDelete(true);
  };

  // Handle sorting by different ways
  const handleSortingType = (e, newSortingType) => {
    setSortingType(newSortingType);
    // Sorting by name
    if (newSortingType === "name") {
      tasks.sort(function (a, b) {
        let nameA = a.name.toUpperCase(); // ignore upper and lowercase
        let nameB = b.name.toUpperCase();

        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }

        // names equal
        return 0;
      });
    } else if (newSortingType === "date") {
      // Sorting by date
      tasks.sort(function (a, b) {
        return moment(a.date) - moment(b.date);
      });
    } else if (newSortingType === "completed") {
      // Sorting by completed
      tasks.sort(function (a, b) {
        if (a.completed === b.completed) {
          return 0;
        }
        return a.completed ? -1 : 1;
      });
    }
  };

  // Request to update the completed field of a task
  const handleChangeCompleted = (task) => {
    axios
      .put(`http://localhost:4000/${task.id}`, { updatingField: "completed" })
      .then((response) => {
        console.log(response);
        setTasks(response.data.originalTasks);
        setTaskSelected(response.data.taskUpdated);
        if (response.data.taskUpdated.completed) {
          enqueueSnackbar("Task complete", { variant: "info" });
        } else {
          enqueueSnackbar("Task incomplete", { variant: "warning" });
        }
      })
      .catch((error) => {
        console.log("ERROR ON COMPLETE TASK: ", error);
        enqueueSnackbar("Error while completing task", { variant: "error" });
      });
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid>
        <Typography variant="h6">Tasks</Typography>
      </Grid>
      <Grid>
        <ToggleButtonGroup
          color="primary"
          value={sortingType}
          exclusive
          onChange={handleSortingType}
        >
          <Tooltip title="Order by Name">
            <ToggleButton value="name">
              <SortByAlpha />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Order by Date">
            <ToggleButton value="date">
              <DateRange />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Order by Completed">
            <ToggleButton value="completed">
              <Rule />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Grid>
      <Grid>
        {tasks.map((task, index) => (
          <Grid key={index} container direction="row">
            <Grid>
              <Tooltip
                title={
                  task.completed
                    ? "Mark task as incompleted"
                    : "Mark task as completed"
                }
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleChangeCompleted(task)}
                />
              </Tooltip>
              <ToggleButton
                value={task.id}
                selected={false}
                onChange={handleSelectTask}
                sx={{ textDecorationLine: task.completed && "line-through" }}
              >
                {task.name}
              </ToggleButton>
              <Tooltip title="Delete Task">
                <IconButton
                  color="error"
                  onClick={() => handleClickDeleteTask(task.id)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Button
            name="Create"
            variant="contained"
            color="success"
            endIcon={<PostAdd />}
            onClick={handleClickCreateTask}
          >
            Create
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
