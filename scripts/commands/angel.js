// Store running intervals globally
if (!global.angelIntervals) global.angelIntervals = new Map();

module.exports.config = {
  name: "angel",
  version: "1.0.1",
  credits: "Gry KJ",
  description: "Friendly test angel command",
  category: "admin",
  usages: "angel",
  permission: 2,
  cooldowns: 5
};

module.exports.onLoad = function() {
  // Nothing to do on load for now
};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const { senderID } = event;

  // Prevent multiple angels in same thread
  if (global.angelIntervals.has(threadID)) {
    return api.sendMessage("⚠️ Angel command is already running in this thread.", threadID, event.messageID);
  }
  return api.sendMessage("Angel activated.", threadID, event.messageID);
};
