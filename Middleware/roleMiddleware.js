const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // Assuming you have a user object with roles attached to it in your authentication process
    const userRoles = req.user && req.user.roles;

    if (!userRoles || !Array.isArray(userRoles)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the user's role is included in the allowedRoles array
    const isAllowed = userRoles.some((role) => allowedRoles.includes(role));

    if (!isAllowed) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    // If the user's role is allowed, proceed to the next middleware or route
    next();
  };
};

module.exports = roleMiddleware;
  