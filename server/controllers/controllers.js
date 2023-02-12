const originalTasks = [
  {
    id: 1,
    name: "Recoger la mierda del perro",
    description: "Recoger la caca de Luchi antes de que venga mi madre",
    completed: false,
    date: "Feb, 14 2023 12:00",
  },
  {
    id: 2,
    name: "Zacer los deberes",
    description: "Matemáticas, física y filosofía",
    completed: true,
    date: "Feb, 10 2023 12:00",
  },
  {
    id: 3,
    name: "Ir al médico",
    description: "Preguntar por análisis de sangre y el colesterol alto",
    completed: false,
    date: "Feb, 12 2023 12:00",
  },
];

export const getTasks = (req, res) => {
  res.send("Getting tasks");
};

export const createTask = (req, res) => {
  res.json(originalTasks);
};

export const readTask = (req, res) => {
  res.send("Showing task");
};

export const updateTask = (req, res) => {
  res.send("Updating task");
};

export const deleteTask = (req, res) => {
  res.send("Deleting task");
};
