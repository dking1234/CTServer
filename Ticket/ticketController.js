const Ticket = require('./ticketModal');
const Schedule = require('../Schedule/scheduleModal');
const User = require('../User/Modal');

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { userId, scheduleId, companyName, seatNumber, total, boardingPoint, droppingPoint } = req.body;

    const paymentConfirmed = true; // Replace with your actual payment confirmation logic.

    if (paymentConfirmed) {
      const scheduleDetails = await Schedule.findById(scheduleId);

      if (!scheduleDetails) {
        return res.status(404).json({ message: 'Schedule not found.' });
      }

      // Extract necessary information from the fetched schedule details
      const {
        departureDate,
        departureTime,
        arrivalTime,
        origin,
        destination,
      } = scheduleDetails;

      // Create a new ticket
      const newTicket = new Ticket({
        userId,
        scheduleId,
        companyName,
        departureDate,
        departureTime,
        arrivalTime,
        seatNumber,
        origin,
        destination,
        boardingPoint, // Include boardingPoint
        droppingPoint, // Include droppingPoint
        price: total,
      });

      await newTicket.save();

      const ticketId = newTicket._id;

      res.status(201).json({ message: 'Ticket booked successfully!', ticketId });
    } else {
      res.status(400).json({ message: 'Payment not confirmed.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json({ message: 'Ticket updated successfully', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update ticket', error: error.message });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    await Ticket.findByIdAndDelete(ticketId);
    res.status(200).json({ message: 'Ticket cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel ticket', error: error.message });
  }
};

// Get all tickets for a user
const getUserTickets = async (req, res) => {
   try {
    const userId = req.params.userId;

    const tickets = await Ticket.find({ userId });

    if (!tickets) {
      return res.status(404).json({ message: 'Tickets not found for the given userId' });
    }

    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get ticket', error: error.message });
  }
};

module.exports = {
  createTicket,
  updateTicketStatus,
  deleteTicket,
  getUserTickets,
  getTicketById,
};
