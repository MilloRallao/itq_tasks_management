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
export const createTask = (req, res) => {
  maxID++;
  originalTasks.push({
    id: maxID,
    ...req.body,
  });
  res.json(originalTasks);
};

// Return one task
export const readTask = (req, res) => {
  const value = req.params.id;
  const taskSelected = originalTasks.filter((task) => task.id == value);
  res.json(taskSelected);
};

// Update one task (Or only "completed" field) and return all tasks (And the task updated in case of updating "completed" field)
export const updateTask = (req, res) => {
  let taskUpdated;
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
