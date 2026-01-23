
// Store running intervals globally
if (!global.angelIntervals) global.angelIntervals = new Map();

module.exports.config = {
  name: "angel",
  version: "1.0.2",
  credits: "IMRAN",
  description: "Sends periodic messages for one hour",
  category: "admin",
  usages: "angel",
  prefix: true,
  permission: 0,
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

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
