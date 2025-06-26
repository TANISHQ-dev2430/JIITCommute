const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seats: { type: Number, required: true, min: 1, max: 3 },
    time: { type: Date, required: true },
    fare: { type: Number, required: true, min: 0 },
    destination: { type: String, enum: ['62', '128'], required: true },
    createdAt: { type: Date, default: Date.now, index: true },
    isActive: { type: Boolean, default: true },
    joinedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
});

// TTL index: Automatically delete trips 15 days (1296000 seconds) after creation
tripSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 });

module.exports = mongoose.model('Trip', tripSchema);
