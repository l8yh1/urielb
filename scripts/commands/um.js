// Store running intervals globally
if (!global.umIntervals) global.umIntervals = new Map();

module.exports.config = {
  name: "um",
  version: "1.0.0",
  credits: "Gry KJ",
  description: "Friendly test um command",
  category: "admin",
  usages: "um",
  cooldowns: 5
};

module.exports.onLoad = function() {
  // Nothing to do on load for now
};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const senderID = String(event.senderID);

  // Allowed users: admin, operator, owner
  const allowedUsers = [
    ...(global.config.ADMINBOT || []),
    ...(global.config.OPERATOR || []),
    ...(global.config.OWNER || [])
  ].map(String);

  if (!allowedUsers.includes(senderID)) {
    return api.sendMessage("❌ This command is for bot admins only.", threadID, event.messageID);
  }

  // Prevent multiple runs in same thread
  if (global.umIntervals.has(threadID)) {
    return api.sendMessage("⚠️ Um command is already running in this chat.", threadID, event.messageID);
  }

  // Send start message
  api.sendMessage("✅ Um Active", threadID, event.messageID);

  let counter = 0;

  const interval = setInterval(() => {
    counter++;
    api.sendMessage("Hi, what are you all doing?", threadID);

    // Stop after 60 messages (~1 hour)
    if (counter >= 60) {
      clearInterval(interval);
      global.umIntervals.delete(threadID);
      api.sendMessage("🛑 Um stopped after 1 hour.", threadID);
    }
  }, 60 * 1000); // every 60 seconds

  // Save interval reference
  global.umIntervals.set(threadID, interval);
};
