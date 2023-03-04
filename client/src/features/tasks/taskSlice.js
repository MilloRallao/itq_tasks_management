import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { snackActions } from "../../app/SnackBarUtils";

export const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    selectedTask: {},
  },
  reducers: {
    getTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks = action.payload;
    },
    getTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    updateTask: (state, action) => {
      state.tasks = action.payload.originalTasks;
      Object.keys(state.selectedTask).length === 0
        ? null
        : (state.selectedTask = action.payload.taskUpdated);
    },
    deleteTask: (state, action) => {
      state.tasks = action.payload;
      state.selectedTask = {};
    },
  },
});

export const { getTasks, addTask, getTask, updateTask, deleteTask } =
  taskSlice.actions;

export default taskSlice.reducer;

export const fetchAllTasks = () => {
  return (dispatch) => {
    axios
      .get("http://localhost:4000/")
      .then((response) => {
        dispatch(getTasks(response.data));
      })
      .catch((error) => console.log("ERROR ON GET TASKS:", error));
  };
};

export const fetchAddTask = (newTask) => {
  return (dispatch) => {
    axios
      .post("http://localhost:4000/create", newTask)
      .then((response) => {
        dispatch(addTask(response.data));
        snackActions.success("Task created successfully");
      })
      .catch((error) => {
        console.log("ERROR ON CREATE TASK: ", error);
        snackActions.error("Error while creating task");
      });
  };
};

export const fetchUpdateTask = (taskSelected) => {
  return (dispatch) => {
    axios
      .put(`http://localhost:4000/${taskSelected.id}`, taskSelected)
      .then((response) => {
        dispatch(updateTask(response.data));
        dispatch(getTask(taskSelected));
        snackActions.success("Task updated successfully");
      })
      .catch((error) => {
        console.log("ERROR ON UPDATE TASK: ", error);
        snackActions.error("Error while updating task");
      });
  };
};

export const updateCompletedTask = (value) => {
  return (dispatch) => {
    axios
      .put(`http://localhost:4000/${value.id}`, { updatingField: "completed" })
      .then((response) => {
        dispatch(updateTask(response.data));
        if (response.data.taskUpdated.completed) {
          snackActions.info("Task complete");
        } else {
          snackActions.warning("Task incomplete");
        }
      })
      .catch((error) => {
        console.log("ERROR ON COMPLETE TASK: ", error);
        snackActions.error("Error while completing task");
      });
  };
};

export const fetchOneTask = (value) => {
  return (dispatch) => {
    axios
      .get(`http://localhost:4000/${value}`)
      .then((response) => {
        dispatch(getTask(response.data[0]));
      })
      .catch((error) => console.log("ERROR ON GET TASK:", error));
  };
};

export const fetchDeleteTask = (value) => {
  return (dispatch) => {
    axios
      .delete(`http://localhost:4000/${value}`)
      .then((response) => {
        dispatch(deleteTask(response.data));
        snackActions.success("Task deleted successfully");
      })
      .catch((error) => {
        console.log("ERROR DELETING TASK:", error);
        snackActions.error("Error while deleting task");
      });
  };
};
