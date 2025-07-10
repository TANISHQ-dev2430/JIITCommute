const Trip = require('../models/trip.model');
const tripService = require('../services/trip.service');
const User = require('../models/user.model');
const { sendPushNotification } = require('../services/push.service');

module.exports.createTrip = async (req, res) => {
    try {
        const { seats, time, fare, destination } = req.body;
        if (!['62', '128'].includes(destination)) {
            return res.status(400).json({ message: 'Invalid destination' });
        }
     
        const existing = await Trip.findOne({ host: req.user._id, isActive: true });
        if (existing) {
            return res.status(400).json({ message: 'You already have an active trip.' });
        }
     
        const joinedActive = await Trip.findOne({ joinedUsers: req.user._id, isActive: true });
        if (joinedActive) {
            return res.status(400).json({ message: 'You have already joined an active trip. Cancel it first.' });
        }
        const trip = await Trip.create({
            host: req.user._id,
            seats,
            time,
            fare,
            destination
        });
        res.status(201).json({ trip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAllTrips = async (req, res) => {
    try {
       
        const trips = await Trip.find({ isActive: true })
            .populate('host', 'fullname enrollmentNumber');
        res.json({ trips });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.updateTrip = async (req, res) => {
    try {
        const trip = await tripService.updateTrip(req.params.id, req.user._id, req.body);
        if (!trip) return res.status(404).json({ message: "Trip not found or unauthorized" });
        res.json({ trip });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports.getMyTrips = async (req, res) => {
    try {
      
        const trips = await Trip.find({ host: req.user._id, isActive: true })
            .populate('joinedUsers', 'fullname enrollmentNumber batch mobileNo');
        res.json({ trips });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports.deleteTrip = async (req, res) => {
    try {
        // Soft delete: set isActive to false and isDeleted to true
        const result = await Trip.findOneAndUpdate(
            { _id: req.params.id, host: req.user._id },
            { isActive: false, isDeleted: true, deletedAt: new Date() },
            { new: true }
        );
        if (!result) return res.status(404).json({ message: "Trip not found or unauthorized" });
        const ChatMessage = require('../models/chatMessage.model');
        await ChatMessage.deleteMany({ tripId: req.params.id });
        res.json({ message: "Trip deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.joinTrip = async (req, res) => {
    try {
        const userId = req.user._id;
        const alreadyJoined = await Trip.findOne({
            joinedUsers: userId,
            isActive: true
        });
        if (alreadyJoined) {
            return res.status(400).json({ message: "You have already joined another trip. Cancel it first." });
        }
        const trip = await Trip.findById(req.params.id);
        if (!trip || !trip.isActive) return res.status(404).json({ message: "Trip not found or inactive" });
        const seatsLeft = trip.seats - (trip.joinedUsers?.length || 0);
        if (seatsLeft <= 0) return res.status(400).json({ message: "No seats available" });
        if (!Array.isArray(trip.joinedUsers)) {
        trip.joinedUsers = [];
        }
        if (!trip.joinedUsers.includes(userId)) {
            trip.joinedUsers.push(userId);
            await trip.save();
            
            if (trip.host && trip.host.toString() !== userId.toString()) {
                await sendPushNotification(trip.host, {
                    title: 'New Join Request',
                    body: 'A user has joined your trip!',
                    data: { hostId: trip.host.toString(), event: 'joinRequest' }
                });
            }
        }
        res.json({ message: "Joined trip successfully", trip });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports.cancelJoin = async (req, res) => {
    try {
        const userId = req.user._id;
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        trip.joinedUsers = trip.joinedUsers.filter(
            (id) => id.toString() !== userId.toString()
        );
        await trip.save();
        // Notify host about cancellation
        if (trip.host && trip.host.toString() !== userId.toString()) {
            await sendPushNotification(trip.host, {
                title: 'Join Cancelled',
                body: 'A user has cancelled their join request.',
                data: { hostId: trip.host.toString(), event: 'joinCancelled' }
            });
        }
        res.json({ message: "Left trip successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports.getJoinedTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ 
            joinedUsers: req.user._id, 
            isActive: true 
        })
        .populate('host', 'fullname enrollmentNumber batch mobileNo');
        res.json({ trips });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports.getTripHistory = async (req, res) => {
    try {
        const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
        // Fetch user's hiddenTrips
        const user = await User.findById(req.user._id).select('hiddenTrips');
        const hiddenTrips = user?.hiddenTrips || [];

        const trips = await Trip.find({
            $and: [
                {
                    $or: [
                        { host: req.user._id },
                        { joinedUsers: req.user._id }
                    ]
                },
                { createdAt: { $gte: fifteenDaysAgo } },
                { _id: { $nin: hiddenTrips } }
            ]
        })
        .populate('host', 'fullname enrollmentNumber batch mobileNo')
        .populate('joinedUsers', 'fullname enrollmentNumber batch mobileNo');
        res.json({ trips });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports.removeUserFromTrip = async (req, res) => {
    try {
        const { id } = req.params; 
        const { userId } = req.body; 
        
        const trip = await Trip.findOne({ _id: id, host: req.user._id, isActive: true });
        if (!trip) return res.status(404).json({ message: "Trip not found or unauthorized" });
        trip.joinedUsers = trip.joinedUsers.filter(
            (uid) => uid.toString() !== userId.toString()
        );
        await trip.save();
        // Notify removed user (deduplicated)
        const userIdsToNotify = new Set([userId.toString()]);
        for (const notifyId of userIdsToNotify) {
            console.log('[DEBUG] Sending FCM to', notifyId, {
                title: 'Removed from Trip',
                body: 'You have been removed from a trip by the host.',
                data: { event: 'removedFromTrip' }
            });
            await sendPushNotification(notifyId, {
                title: 'Removed from Trip',
                body: 'You have been removed from a trip by the host.',
                data: { event: 'removedFromTrip' }
            });
        }
        res.json({ message: "User removed from trip" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports.deleteTripHistory = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, { $addToSet: { hiddenTrips: tripId } });

        res.json({ message: "Trip removed from your history" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};