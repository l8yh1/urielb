// vi/en

// Store running intervals globally
if (!global.angelIntervals) global.angelIntervals = new Map();

module.exports.config = {
  name: "angel",
  version: "1.0.0",
  credits: "Gry KJ",
  description: "Friendly test angel command",
  category: "admin",
  usages: "angel",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;
  const senderID = String(event.senderID);

  // Allowed users
  const allowedUsers = [
    ...(global.config.ADMINBOT || []),
    ...(global.config.OPERATOR || []),
    ...(global.config.OWNER || [])
  ].map(String);

  if (!allowedUsers.includes(senderID)) {
    return api.sendMessage(
      "❌ This command is for bot admins only.",
      threadID,
      event.messageID
    );
  }

  // Prevent multiple angels in the same thread
  if (global.angelIntervals.has(threadID)) {
    return api.sendMessage(
      "⚠️ Angel command is already running in this chat.",
      threadID,
      event.messageID
    );
  }

  // Send angel start message
  api.sendMessage("✅ Angel Active", threadID, event.messageID);

  let
