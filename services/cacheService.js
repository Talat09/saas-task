// Redis cache functionality removed
const setCache = async () => { throw new Error('Cache disabled'); };
const getCache = async () => { throw new Error('Cache disabled'); };
const deleteCache = async () => { throw new Error('Cache disabled'); };
const generateSummaryKey = () => { throw new Error('Cache disabled'); };

module.exports = {
  setCache,
  getCache,
  deleteCache,
  generateSummaryKey,
};
