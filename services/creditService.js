const User = require("../models/User");

const deductCredit = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.credits < 1) {
    throw new Error("Insufficient credits");
  }

  user.credits -= 1;
  await user.save();

  return user.credits;
};

const addCredits = async (userId, amount) => {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.credits += amount;
  await user.save();

  return user.credits;
};

module.exports = { deductCredit, addCredits };
