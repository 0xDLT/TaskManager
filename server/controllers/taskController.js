const Task = require('../models/Task');
const { create } = require('../models/User');

//@desc Get all tasks(admin: all , User: only assigned tasks)
//@route GET /api/tasks
//@access Private
const getTasks = async (req, res) => {
    try {
        const {status} = req.query; // Get status from query parameters
        let filter = {};

        if (status) {
            filter.status = status; // Filter by status if provided
        }

        let tasks;

        if (req.user.role === 'admin') {
            // Admin can see all tasks
            tasks = await Task.find(filter).populate(
                'assignedTo', 'name email profileImageUrl');
        }else {
            tasks = await Task.find({...filter, assignedTo: req.user._id}).populate(
                'assignedTo', 'name email profileImageUrl');
        }

        //add completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(item => item.completed).length;
                return {
                    ...task._doc,
                    completedTodoCount: completedCount,
                };
            })
        );

        // status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === 'admin' ? {} : { assignedTo: req.user._id }   
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: 'Pending',
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id })
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: 'In-progress',
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: 'Done',
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id })
        });

        res.status(200).json({
            tasks,
            statusSummary: {
                all: allTasks,
                pending: pendingTasks,
                inProgress: inProgressTasks,
                completed: completedTasks
            },
            message: "Tasks fetched successfully"
        });

    }catch (error){
        res.status(500).json({ message: "Server Error" });
    }
};

//@desc Get task by ID
//@route GET /api/tasks/:id
//@access Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            'assignedTo', 'name email profileImageUrl'
        ); 
    
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
    }catch (error){
        res.status(500).json({ message: "Server Error" });
    }
};

//@desc Create a new task (admin only)
//@route POST /api/tasks
//@access Private (admin only)
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist} = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "AssignedTo must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id, // Assuming req.user is set by the auth middleware
            todoChecklist,
            attachments,
        });

        res.status(201).json({ message: "Task created successfully", task });
    }catch (error){
        res.status(500).json({ message: "Server Error" });
    }
};

//@desc Update task details
//@route PUT /api/tasks/:id
//@access Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({ message: "Task not found" });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "AssignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;   
        }

        const updatedTask = await task.save();
        res.json({ message: "Task updated successfully", updatedTask });

    }catch (error){
        res.status(500).json({ message: "Server Error" });
    }
};

//@desc Delete a task (admin only)
//@route DELETE /api/tasks/:id
//@access Private (admin only)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    }catch (error){
        res.status(500).json({ message: "Server Error" });
    }
};

//@desc Update task status (admin and user)
//@route PUT /api/tasks/:id/status
//@access Private
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: "Task not found" });

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString());

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }

        task.status = req.body.status || task.status;
        
        if(task.status === 'Done') {
            // If status is done, set progress to 100%
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Task status updated successfully", task });
    }catch (error){
        res.status(500).json({ message: "Server Error" });
    }
};

//@desc Update task checklist (admin and user)
//@route PUT /api/tasks/:id/todo
//@access Private
const updateTaskChecklist = async (req, res) => {
    try {
        const {todoChecklist} = req.body;
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({ message: "Task not found" });

        if(!task.assignedTo.includes(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }

        task.todoChecklist = todoChecklist;

        // Auto-update progress based on checklist completion
        const completedCount = task.todoChecklist.filter(item => item.completed).length;
        const totalCount = task.todoChecklist.length;
        task.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        //auto-mark task as done if all checklist items are completed
        if (task.progress === 100) {
            task.status = 'Done';
        } else if (task.status === 'Done') {
            task.status = 'In-progress'; // Reset status if not all items are completed
        }else {
            task.status = 'In-progress'; // Ensure status is in-progress if not done
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            'assignedTo', 'name email profileImageUrl'
        );

        res.json({ message: "Task checklist updated successfully", task:updatedTask });
    }catch (error){
        res.status(500).json({ message: "Server Error" });
    }
};

//@desc Get dashboard data for tasks (admin only)
//@route GET /api/tasks/dashboard-date
//@access Private (admin only)
const getDashboardData = async (req, res) => {
    try {
        //fetch all tasks
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const completedTasks = await Task.countDocuments({ status: 'Done' });
        const inProgressTasks = await Task.countDocuments({ status: 'In-progress' });
        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'Done' } // Exclude completed tasks
        });

        // Ensure all possible statuses are included
        const taskStatues = ["Pending", "In-progress", "Done", "overdue"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
    ]);

    const taskDistribution = taskStatues.reduce((acc, status) => {
        const formattedKey = status.replace(/\s+/g, ""); //remove spaces
        acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
        return acc;
    }, {}); 

    taskDistribution["All"] = totalTasks;

    const taskPriorities = ['Low', 'Medium', 'High'];
    const taskPrioritiesLevelsRaw = await Task.aggregate([
        {
            $group: {
                _id: "$priority",
                count: { $sum: 1 }
            }
        }
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
        acc[priority] = taskPrioritiesLevelsRaw.find((item) => item._id === priority)?.count || 0;
        return acc;
    }, {});


    //fetch recent 10 tasks
    const recentTasks = await Task.find().sort({createdAt: -1}).limit(10).select(
        'title status dueDate priority createdAt'   
    );

    res.status(200).json({
        statistics: {
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            overdueTasks,
        },
        charts: {
            taskDistribution,
            taskPriorityLevels
        },
        recentTasks,
    });
    }catch (error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//@desc Get user dashboard data (admin and user)
//@route GET /api/tasks/user-dashboard-data
//@access Private
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // only fetch data for logged-in user

        //fetch all statistics for user-specific tasks
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({
            assignedTo: userId,
            status: 'Pending'
        });
        
        const inProgressTasks = await Task.countDocuments({
            assignedTo: userId,
            status: 'In-progress'
        });
        
        const completedTasks = await Task.countDocuments({
            assignedTo: userId,
            status: 'Done'
        });
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: 'Done' }, // Exclude completed tasks
            dueDate: { $lt: new Date() } // Overdue tasks
        });

        //task distribution by status
        const taskStatues = ["Pending", "In-progress", "Done", "overdue"];
        const taskDistributionRaw = await Task.aggregate([
            {$match: { assignedTo: userId } },// Filter by assigned user
            {$group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const taskDistribution = taskStatues.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); //remove spaces
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks;

        //task distribution by priority
        const taskPriorities = ['Low', 'Medium', 'High'];
        const taskPrioritiesLevelsRaw = await Task.aggregate([
            {$match: { assignedTo: userId } }, // Filter by assigned user
            {$group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPrioritiesLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        //fetch recent 10 tasks for user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status dueDate priority createdAt');

        res.status(200).json({
            statistics: {  
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks,
        });
        
    }catch (error){
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData,
};