const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//@desc Get all users
//@route GET /api/users
//access Private 
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user"}).select('-password');

        //Add task counts to each user
        const usersWithTaskCount = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "in-progress" });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "done" });    

            return {
                ...user._doc, //include all existing user fields
                pendingTasks,
                inProgressTasks,
                completedTasks
            };
        }));

            res.json(usersWithTaskCount);
    }catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

//@desc Get user by ID 
//@route GET /api/users/:id
//@access Private 
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    }catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    getUsers,
    getUserById
};