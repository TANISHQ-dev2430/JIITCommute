const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const tripController = require('../controllers/trip.controller');
const chatMessage = require('../models/chatMessage.model');
const { doneTrip } = require('../controllers/trip.controller');

router.post('/create', authMiddleware, tripController.createTrip);
router.put('/:id', authMiddleware, tripController.updateTrip);    // Update trip
router.delete('/:id', authMiddleware, tripController.deleteTrip); // Delete trip
router.get('/all', authMiddleware, tripController.getAllTrips); // Get all active trips
router.get('/my', authMiddleware, tripController.getMyTrips); // Get trips hosted by current user
router.post('/:id/join', authMiddleware, tripController.joinTrip);
router.patch('/:id/cancel-join', authMiddleware, tripController.cancelJoin); // User cancels their join
router.get('/joined', authMiddleware, tripController.getJoinedTrips); // Get trips user joined
router.get('/history', authMiddleware, tripController.getTripHistory); // Get trip history (hosted or joined, last 15 days)
router.delete('/history/:id',authMiddleware, tripController.deleteTripHistory);
router.patch('/:id/remove-user', authMiddleware, tripController.removeUserFromTrip); // Host removes a joined user
router.get('/:tripId/chat', async (req, res) => {
  const { tripId } = req.params;
  const messages = await chatMessage.find({ tripId }).populate('sender', 'fullname');
  res.json({ messages });
});
router.patch('/done/:id', authMiddleware, doneTrip); // Mark trip as done
// Add POST /trips endpoint for trip creation (for recreate trip)
router.post('/', authMiddleware, tripController.createTrip);
module.exports = router;