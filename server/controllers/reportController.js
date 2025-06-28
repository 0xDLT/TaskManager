const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

//@desc Export all tasks as an Excel file
//@route GET /api/reports/export/tasks
//@access Private (Admin Only)
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate("assignedTo", "name email");

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 20 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 15 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];

        tasks.forEach(task => {
            let assignedTo = "Unassigned";
            if (Array.isArray(task.assignedTo)) {
                assignedTo = task.assignedTo.map(u => `${u.name} (${u.email})`).join(", ");
            } else if (task.assignedTo) {
                assignedTo = `${task.assignedTo.name} (${task.assignedTo.email})`;
            }

            worksheet.addRow({
                _id: task._id.toString(),
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : "",
                assignedTo
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=tasks_report.xlsx`
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        res.status(500).json({ message: "Error exporting task", error: error.message });
    }
};

//@desc Export user-task report as an Excel file
//@route GET /api/reports/export/users
//@access Private (Admin Only)
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate("assignedTo", "name email");

        const userTaskMap = {};

        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0
            };
        });

        userTasks.forEach((task) => {
            let assignedUsers = [];
            if (Array.isArray(task.assignedTo)) {
                assignedUsers = task.assignedTo;
            } else if (task.assignedTo) {
                assignedUsers = [task.assignedTo];
            }

            assignedUsers.forEach((assignedUser) => {
                const userData = userTaskMap[assignedUser._id];
                if (userData) {
                    userData.taskCount += 1;
                    if (task.status === "Pending") {
                        userData.pendingTasks += 1;
                    } else if (task.status === "Done") {
                        userData.completedTasks += 1;
                    } else if (task.status === "In Progress") {
                        userData.inProgressTasks += 1;
                    }
                }
            });
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Tasks Report");

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 30 },
            { header: "Total Tasks", key: "taskCount", width: 15 },
            { header: "Pending Tasks", key: "pendingTasks", width: 15 },
            { header: "Completed Tasks", key: "completedTasks", width: 18 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 18 }
        ];

        Object.values(userTaskMap).forEach(user => {
            worksheet.addRow(user);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=users_task_report.xlsx`
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        res.status(500).json({ message: "Error exporting user report", error: error.message });
    }
};

module.exports = {
    exportTasksReport,
    exportUsersReport
};
