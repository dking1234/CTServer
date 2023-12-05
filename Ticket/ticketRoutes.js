const express = require('express');
const router = express.Router();
const {
  createTicket,
  updateTicketStatus,
  deleteTicket,
  getUserTickets,
  getTicketById
} = require('./ticketController');

router.post('/tickets', createTicket);
router.put('/tickets/:ticketId/status', updateTicketStatus);
router.delete('/tickets/:ticketId', deleteTicket);
router.get('/users/:userId/tickets', getUserTickets);
router.get('/tickets/:ticketId', getTicketById);

module.exports = router;
