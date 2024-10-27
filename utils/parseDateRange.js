// Utility function to parse date range from query parameters
const parseDateRange = (startDate, endDate) => {
  try {
    let query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    return query;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default parseDateRange;
