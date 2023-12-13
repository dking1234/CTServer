const express = require('express');
const router = express.Router();
const {
  createTicket,
  updateTicketStatus,
  deleteTicket,
  getUserTickets,
  getTicketById,
  getTicketIdByScheduleId
} = require('./ticketController');

router.post('/create-tickets', createTicket);
router.put('/tickets/:ticketId/status', updateTicketStatus);
router.delete('/tickets/:ticketId', deleteTicket);
router.get('/tickets/user/:userId', getUserTickets);
router.get('/tickets/:ticketId', getTicketById);

module.exports = router;
