import React, { useState } from "react";
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
import moment from "moment";

export default function TasksListView({
  tasks,
  setTasks,
  setTaskSelected,
  handleClickCreateTask,
  setOpenDialogDelete,
}) {
  const [sortingType, setSortingType] = useState("");

  const handleSelectTask = (e) => {
    const { value } = e.target;
    const taskSelected = tasks.filter((task) => task.id == value);
    setTaskSelected(taskSelected[0]);
  };

  const handleClickDeleteTask = () => {
    setOpenDialogDelete(true);
  };

  const handleSortingType = (e, newSortingType) => {
    setSortingType(newSortingType);
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
      tasks.sort(function (a, b) {
        return moment(a.date) - moment(b.date);
      });
    } else if (newSortingType === "completed") {
      tasks.sort(function (a, b) {
        if (a.completed === b.completed) {
          return 0;
        }
        return a.completed ? -1 : 1;
      });
    }
  };

  const handleChangeCompleted = (taskID) => {
    setTasks((prevState) => {
      let tasks = [...prevState];
      let taskIndex = tasks.findIndex((task) => task.id === taskID);
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      return tasks;
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
                    ? "Mark task as uncompleted"
                    : "Mark task as completed"
                }
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleChangeCompleted(task.id)}
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
                <IconButton color="error" onClick={handleClickDeleteTask}>
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
