import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  readTask,
  updateTask,
} from "../controllers/controllers.js";

const router = Router();

// INDEX
router.get("/", getTasks);

// CREATE
router.post("/create", createTask);

// READ
router.get("/:id", readTask);

// UPDATE
router.put("/:id", updateTask);

// DELETE
router.delete("/:id", deleteTask);

export default router;
