const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.roleId?.name;

    if (!userRole) {
      return res.status(403).json({
        message: "User role not found",
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

export default authorize;