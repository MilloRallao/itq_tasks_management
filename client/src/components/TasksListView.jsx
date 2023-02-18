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
  auxTasks,
  taskSelected,
  setTaskSelected,
  handleClickCreateTask,
  setOpenDialogDelete,
  setTaskDeletedID,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [sortingType, setSortingType] = useState("");
  const [toggleTaskSelected, setToggleTaskSelected] = useState({
    id: undefined,
    active: false,
  });

  // Request to get a task
  const handleSelectTask = (e) => {
    const { value } = e.target;
    setToggleTaskSelected((prevState) => {
      // Only do the request when the task is inactive or click in a different task
      if (!toggleTaskSelected.active || prevState.id != value) {
        axios
          .get(`http://localhost:4000/${value}`)
          .then((response) => {
            setTaskSelected(response.data[0]);
          })
          .catch((error) => {
            console.log("ERROR GETTING A TASK:", error);
          });
      } else {
        setTaskSelected({});
      }
      return {
        id: value,
        active: prevState.id != value || !prevState.active, // state depends of tasks ID's or previous active state
      };
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
    // Sorting by name (Only if not selected previously)
    if (newSortingType === "name" && sortingType !== "name") {
      setTasks(tasks.sort(sortingFunction(newSortingType)));
    } else if (newSortingType === "date" && sortingType !== "date") {
      // Sorting by date (Only if not selected previously)
      setTasks(tasks.sort(sortingFunction(newSortingType)));
    } else if (newSortingType === "completed" && sortingType !== "completed") {
      // Filtering by completed (Only if not selected previously)
      setTasks(tasks.filter((a) => a.completed === true));
    } else {
      // If some button are selected, it becomes unselected and original tasks are showed
      setSortingType("");
      setTasks(auxTasks);
    }
  };

  const sortingFunction = (type) => {
    return function (a, b) {
      if (type === "name") {
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
      } else if (type === "date") {
        return moment(a.date) - moment(b.date);
      }
    };
  };

  // Request to update the completed field of a task
  const handleChangeCompleted = (task) => {
    axios
      .put(`http://localhost:4000/${task.id}`, { updatingField: "completed" })
      .then((response) => {
        setTasks(response.data.originalTasks);
        Object.keys(taskSelected).length === 0 ? null : setTaskSelected(response.data.taskUpdated);
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
            <ToggleButton value="name" selected={sortingType === "name"}>
              <SortByAlpha />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Order by Date">
            <ToggleButton value="date" selected={sortingType === "date"}>
              <DateRange />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Filter by Completed">
            <ToggleButton
              value="completed"
              selected={sortingType === "completed"}
            >
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
                selected={
                  toggleTaskSelected.id == task.id && toggleTaskSelected.active
                }
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
