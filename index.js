const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

// routes imports
const userRoutes = require('./User/userRoutes');
const notificationRoutes = require('./smsNotification/notificationRoutes');
const otpRoutes = require('./OTP/otpRoutes');
const companyRoutes = require('./Company/companyRoutes');
const busRoutes = require('./Bus/busRoutes');
const scheduleRoutes = require('./Schedule/scheduleRoutes');
const ticketRoutes = require('./Ticket/ticketRoutes');
const adminRoutes = require('./Admin/adminRoutes');
const superAdminRoutes = require('./SuperAdmin/superAdminRoutes');
const passengerRoutes = require('./Passenger/passengerRoutes');
const seatsRoutes = require('./Seats/seatsRoutes');
const bookingRoutes = require('./Booking/bookingRoutes');

const app = express();
const port = process.env.PORT || 80;
const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect('mongodb+srv://ConnectTicket:wilhelmo1234@cluster0.jutvtja.mongodb.net/', {});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to your Node.js and MongoDB backend!');
});

io.on('connection', (socket) => {
  console.log('User connected');

  // Handle seat selection event
  socket.on('selectSeat', (seatNumber) => {
      // Broadcast the selected seat to all connected clients
      io.emit('updateSeats', seatNumber);
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});

// Define your routes here
app.use('/user', userRoutes);
app.use('/notification', notificationRoutes);
app.use('/verify', otpRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api', busRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', ticketRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api', bookingRoutes);
app.use('/api', seatsRoutes);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
