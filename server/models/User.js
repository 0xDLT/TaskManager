const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        email: { type: String, reqired: true, unique: true },
        password: { type: String, required: true },
        profileImageUrl: { type: String, default: null },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
