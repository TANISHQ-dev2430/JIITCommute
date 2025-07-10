dotenv = require('dotenv'); 
dotenv.config(); 
const express = require ('express');
const app = express();
const cors = require('cors'); 
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.route');
const cookieParser = require('cookie-parser');
const tripRoutes = require('./routes/trip.route');
const cron = require('node-cron');
const Trip = require('./models/trip.model'); 

connectToDb();

const allowedOrigins = [
  'http://localhost:5173',
  'https://jiit-commute.vercel.app', 
];
app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use('/trips', tripRoutes);



cron.schedule('*/10 * * * *', async () => {
  const now = new Date();
  await Trip.updateMany(
    { time: { $lte: new Date(now.getTime() - 2 * 60 * 60 * 1000) }, isDeleted: false },
    { isActive: false, isDeleted: true, deletedAt: new Date() }
  );
  console.log('Trips soft deleted if departure was more than 2 hours ago.');
});

app.get('/',(req,res) => { 
    res.send('JIITcommute is under maintenance'); 
}); 


app.use('/users', userRoutes); 

module.exports = app;