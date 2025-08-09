export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/signup", // Register a new user or (Admin or Members)
        LOGIN: "/api/auth/login", // Authenticate a user return JWT Token
        GET_PROFILE: "/api/auth/profile", // Get user profile details
    },

    USERS: {
        GET_ALL_USERS: "/api/users", // Get all users (admin only)
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
        CREATE_USER: "/api/users", // Create a new user (admin only)
        UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
        DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user (admin only)
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get data for the dashboard
        GET_USER_DASHBOARD_DATA: `/api/tasks/user-dashboard-data`, // Get user-specific dashboard data
        GET_ALL_TASKS: "/api/tasks", // Get all tasks
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
        CREATE_TASK: "/api/tasks", // Create a new task
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task

        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update task checklist
    },

    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks", // Export tasks report
        EXPORT_USERS: "/api/reports/export/users", // Export users report
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image", // Upload an image
    },
};