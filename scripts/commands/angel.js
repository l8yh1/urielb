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

  // Prevent multiple angels in same thread
  if (global.angelIntervals.has(threadID)) {
    return api.sendMessage("⚠️ Angel command is already")
