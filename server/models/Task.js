const mongoose = require('mongoose');

const todoschema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
        
    }
);

const taskschema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        status: { type: String, enum: ['Pending', 'in-progress', 'done'], default: 'Pending' },
        dueDate: { type: Date, required: true },
        assignedTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        attachments: [{ type: String }],
        todoChecklist: [todoschema],
        progress: { type: Number, default: 0 }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskschema);