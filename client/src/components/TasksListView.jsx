import React, { useMemo, useState } from "react";
import moment from "moment";
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
import { useDispatch, useSelector } from "react-redux";
import { openDialog, setDialogType } from "../features/dialogs/dialogSlice";
import {
  fetchOneTask,
  getTask,
  updateCompletedTask,
} from "../features/tasks/taskSlice";

export default function TasksListView({ setTaskDeletedID }) {
  const [sortingType, setSortingType] = useState("");
  const [toggleTaskSelected, setToggleTaskSelected] = useState({
    id: undefined,
    active: false,
  });
  const { tasks } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  // Request to get a task
  const handleSelectTask = (e) => {
    const { value } = e.target;
    setToggleTaskSelected((prevState) => {
      // Only do the request when the task is inactive or click in a different task
      if (!toggleTaskSelected.active || prevState.id != value) {
        dispatch(fetchOneTask(value));
      } else {
        dispatch(getTask({}));
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
    dispatch(openDialog("dialogDelete"));
  };

  // Function to sort in different ways
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

  // Handle sorting and filter
  const filterTodos = (tasks, sortingType) => {
    const tasksForSort = [...tasks];
    // Sorting by name
    if (sortingType == "name" || sortingType == "date") {
      return tasksForSort.sort(sortingFunction(sortingType));
    } else if (sortingType == "completed") {
      setToggleTaskSelected({ id: undefined, active: false });
      // Filtering by completed
      return tasksForSort.filter((a) => a.completed === true);
    } else {
      // If some button are selected, it becomes unselected and original tasks are showed
      setSortingType("");
      return tasks;
    }
  };

  // UseMemo to get in cache the original tasks
  const originalTasks = useMemo(
    () => filterTodos(tasks, sortingType),
    [tasks, sortingType]
  );

  // Update the sorting type once ToggleButton is pressed
  const handleSortingType = (e, newSortingType) => {
    setSortingType(newSortingType);
    if (newSortingType == "completed") {
      dispatch(getTask({}));
    }
  };

  // Request to update the completed field of a task
  const handleChangeCompleted = (task) => {
    dispatch(updateCompletedTask(task));
  };

  // Open dialog form to create a task
  const handleClickCreateTask = () => {
    dispatch(openDialog("dialogCreateUpdate"));
    dispatch(setDialogType("create"));
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
        {originalTasks.map((task, index) => (
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
