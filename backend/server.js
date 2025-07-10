const http = require('http'); 
const app = require('./app'); 
const port = process.env.PORT || 4000; 
const server = http.createServer(app); 
const { Server } = require('socket.io');
const cron = require('node-cron');
const Trip = require('./models/trip.model');
const user = require('./models/user.model');
const chatMessage = require('./models/chatMessage.model');
const admin = require('./firebase-admin'); 

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://jiit-commute.vercel.app'  
    ],
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ tripId, userId }) => {
    socket.join(tripId);
  });

  socket.on('chatMessage', async ({ tripId, userId, text }) => {
    const message = await chatMessage.create({ tripId, sender: userId, text });

    const senderUser = await user.findById(userId).select('fullname');

    io.to(tripId).emit('chatMessage', {
      _id: message._id,
      tripId,
      sender: {
        userId,
        fullname: senderUser?.fullname?.firstname
          ? senderUser.fullname
          : { firstname: "Unknown", lastname: "" }
      },
      text,
      sentAt: message.sentAt
    });

    const TripModel = require('./models/trip.model');
    const PushService = require('./services/push.service');
    const trip = await TripModel.findById(tripId).populate('host').populate('joinedUsers');

    if (trip) {
      const joinedUsers = trip.joinedUsers.filter(
        u => u && u._id.toString() !== trip.host._id.toString()
      );
      const allUsers = [trip.host, ...joinedUsers];
      const uniqueRecipients = [];
      const seen = new Set();

      for (const u of allUsers) {
        if (!u || u._id.toString() === userId.toString()) continue;
        const idStr = u._id.toString();
        if (!seen.has(idStr)) {
          uniqueRecipients.push(u);
          seen.add(idStr);
        }
      }

      for (const recipient of uniqueRecipients) {
        await PushService.sendPushNotification(recipient._id, {
          data: {
            title: 'New Chat Message',
            body: `${senderUser?.fullname?.firstname || 'Someone'}: ${text}`,
            event: 'chatMessage',
            tripId: tripId,
            senderId: userId
          }
        });
      }
    }
  });

  socket.on('joinTrip', (tripId) => {
    socket.join(tripId);
  });

  socket.on('leaveTrip', (tripId) => {
    socket.leave(tripId);
  });

  socket.on('disconnect', () => {});
});

// 🕛 Daily midnight: mark expired trips as deleted (soft delete)
cron.schedule('1 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Trip.updateMany(
      { isDeleted: false, createdAt: { $lt: today } },
      { isDeleted: true, deletedAt: new Date(), isActive: false }
    );
  } catch (err) {
    console.error('Error in midnight trip soft delete:', err);
  }
});

// 🧹 Daily: remove trips older than 15 days (hard delete)
cron.schedule('0 0 * * *', async () => {
  const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
  await Trip.deleteMany({ createdAt: { $lt: fifteenDaysAgo } });
  console.log('Old trips deleted (older than 15 days)');
});

server.listen(port, () => { 
  console.log(`server is running on port ${port}`);
});
