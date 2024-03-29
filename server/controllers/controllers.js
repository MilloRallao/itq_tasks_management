import moment from 'moment';

let originalTasks = [
  {
    id: 1,
    name: "Picking up dog poop",
    description:
      "Throw the bag in the rubbish bin, then clean the floor with bleach",
    completed: false,
    date: "Feb, 14 2023 12:00",
  },
  {
    id: 2,
    name: "Doing homeworks",
    description: "Maths, English and History",
    completed: true,
    date: "Feb, 10 2023 12:00",
  },
  {
    id: 3,
    name: "Going to the doctor",
    description:
      "Make an appointment for a blood test and ask about high cholesterol",
    completed: false,
    date: "Feb, 12 2023 12:00",
  },
];

let maxID = 3;

// Return all tasks
export const getTasks = (req, res) => {
  res.json(originalTasks);
};

// Create a task and return all tasks
export const createTask = (req, res, next) => {
  if (req.body.name.length > 40) {
    const error = new Error("Task name too long. Max 40 characters");
    error.status = 500;
    return next(error);
  } else if(req.body.description.length > 250){
    const error = new Error("Task description too long. Max 250 characters");
    error.status = 500;
    return next(error);
  } else if(typeof req.body.completed !== "boolean"){
    const error = new Error("Completed field must be boolean type");
    error.status = 500;
    return next(error);
  } else if(!moment(req.body.date).isValid()){
    const error = new Error("Invalid date");
    error.status = 500;
    return next(error);
  } else {
    maxID++;
    originalTasks.push({
      id: maxID,
      ...req.body,
    });
    res.json(originalTasks);
  }
};

// Return one task
export const readTask = (req, res) => {
  const value = req.params.id;
  const taskSelected = originalTasks.filter((task) => task.id == value);
  res.json(taskSelected);
};

// Update one task (Or only "completed" field) and return all tasks (And the task updated in case of updating "completed" field)
export const updateTask = (req, res, next) => {
  let taskUpdated;

  // If ID doesn't exist
  const taskNotFound = originalTasks.filter((a) => a.id == req.params.id);
  
  if(taskNotFound.length === 0){
    const error = new Error("Invalid ID");
    error.status = 404;
    return next(error);
  }

  originalTasks = originalTasks.map((task, index) => {
    if (task.id == req.params.id) {
      if (req.body.updatingField === "completed") {
        taskUpdated = { ...task, completed: !task.completed };
        return { ...task, completed: !task.completed };
      } else {
        return { ...task, ...req.body };
      }
    }

    return task;
  });

  res.json({ originalTasks, taskUpdated });
};

// Delete a task and return the rest
export const deleteTask = (req, res) => {
  originalTasks = originalTasks.filter(
    (task, index) => task.id != req.params.id
  );
  res.json(originalTasks);
};
