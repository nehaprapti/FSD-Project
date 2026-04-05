export const validateRequired = (fields, source = "body") => {
  return (req, res, next) => {
    const payload = req[source] || {};
    const missingFields = fields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    return next();
  };
};
