import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
  Button,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import PostAdd from "@mui/icons-material/PostAdd";
import SortByAlpha from "@mui/icons-material/SortByAlpha";
import DateRange from "@mui/icons-material/DateRange";
import moment from "moment";

export default function TasksListView({
  tasks,
  taskSelected,
  setTaskSelected,
  handleClickCreateOrUpdateTask,
  setOpenDialogDelete,
}) {
    const [sortingType, setSortingType] = useState("");
  const handleSelectTask = (e, newTaskSelected) => {
    setTaskSelected(newTaskSelected);
  };

  const handleClickDeleteTask = () => {
    setOpenDialogDelete(true);
  };

  const handleSortingType = (e, newSortingType) => {
    setSortingType(newSortingType);
    console.log(newSortingType);
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
    } else {
    }

    console.log(tasks);
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
          <ToggleButton value="name">
            <SortByAlpha />
          </ToggleButton>
          <ToggleButton value="date">
            <DateRange />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid>
        <ToggleButtonGroup
          color="primary"
          value={taskSelected}
          exclusive
          orientation="vertical"
          onChange={handleSelectTask}
          aria-label="Tasks"
        >
          {tasks.map((task, index) => (
            <Grid key={index} container direction="row">
              <Grid>
                <ToggleButton value={task.id}>{task.name}</ToggleButton>
                <IconButton
                  name="Update"
                  color="primary"
                  onClick={handleClickCreateOrUpdateTask}
                >
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={handleClickDeleteTask}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </ToggleButtonGroup>
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
            onClick={handleClickCreateOrUpdateTask}
          >
            Create
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
