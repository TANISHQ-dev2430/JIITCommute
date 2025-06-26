const Trip = require('../models/trip.model');

module.exports.updateTrip = async (tripId, userId, updates) => {
    // Only allow host to update their own trip
    const trip = await Trip.findOneAndUpdate(
        { _id: tripId, host: userId },
        updates,
        { new: true }
    );
    return trip;
};

module.exports.deleteTrip = async (tripId, userId) => {
    // Only allow host to delete their own trip
    const result = await Trip.findOneAndDelete({ _id: tripId, host: userId });
    return result;
};