const express = require('express');
const {protect , adminOnly} = require('../middlewares/authMiddleware');
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
} = require('../controllers/taskController');

const router = express.Router();

//Task Management Routes
router.get("/dashboard-data", protect, adminOnly, getDashboardData);
router.get("/user-dashboard-data", protect , getUserDashboardData);
router.get("/", protect, getTasks);//Get all tasks (admin: all , User: assigned)
router.get("/:id", protect, getTaskById);//Get task by ID
router.post("/", protect, adminOnly ,createTask);//Create a new task (admin only)
router.put("/:id",protect, updateTask);//update task details
router.delete("/:id", protect, adminOnly, deleteTask);//Delete a task (admin only)
router.put("/:id/status", protect, updateTaskStatus);//Update task status (admin and user)
router.put("/:id/todo", protect, updateTaskChecklist);//Update task todo list (admin and user)

module.exports = router;