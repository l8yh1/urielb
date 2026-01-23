
// Store running intervals globally
if (!global.angelIntervals) global.angelIntervals = new Map();

module.exports.config = {
  name: "angel",
  version: "1.0.3",
  credits: "IMRAN",
  description: "Sends periodic messages for one hour",
  category: "utility",
  usages: "",
  permission: 2,
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;

  // Allowed users: Admin, Operator, Owner
  const allowedUsers = [
    ...(global.config.ADMINBOT || []),
    ...(global.config.OPERATOR || []),
    ...(global.config.OWNER || [])
  ].map(String);

  if (!allowedUsers.includes(String(senderID))) {
    return api.sendMessage("❌ This command is for bot admins only.", threadID, messageID);
  }

  if (global.angelIntervals.has(threadID)) {
    return api.sendMessage("⚠️ Angel is already active in this thread.", threadID, messageID);
  }

  api.sendMessage("Engine is active", threadID, messageID);

  const startTime = Date.now();
  const oneHour = 3600000; // 1 hour
  const intervalTime = 15000; // 15 seconds

  const interval = setInterval(() => {
    if (Date.now() - startTime >= oneHour) {
      api.sendMessage("Engine Auto-off", threadID);
      clearInterval(interval);
      global.angelIntervals.delete(threadID);
    } else {
      api.sendMessage("Hi, how are you doing", threadID);
    }
  }, intervalTime);

  global.angelIntervals.set(threadID, interval);
};
