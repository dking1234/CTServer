const Ticket = require('./ticketModal');

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { user, busSchedule, seatNumber, price } = req.body;
    const newTicket = new Ticket({ user, busSchedule, seatNumber, price });
    await newTicket.save();
    res.status(201).json({ message: 'Ticket booked successfully!', ticket: newTicket });
  } catch (error) {
    res.status(400).json({ message: 'Failed to book ticket', error: error.message });
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
    const { userId } = req.params;
    const tickets = await Ticket.find({ user: userId }).populate('busSchedule');
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get tickets', error: error.message });
  }
};

// Get a single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId).populate('busSchedule');
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
